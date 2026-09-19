import os
import json
from datetime import datetime
from functools import wraps

from flask import Flask, jsonify, request, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import razorpay

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
SECRET_KEY = os.getenv("SECRET_KEY", "sarika-secret-key-2024")
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

app = Flask(__name__)
app.secret_key = SECRET_KEY
app.config.update(SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax", SESSION_COOKIE_SECURE=False)

CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173","http://127.0.0.1:5173",
    "http://localhost:5174","http://127.0.0.1:5174",
    "http://localhost:3000","http://10.101.222.75:5173"
])

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    print(f"✅ Razorpay Loaded: {RAZORPAY_KEY_ID}")
else:
    print("❌ Razorpay keys missing")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "sarika_db")

def get_db_connection():
    return mysql.connector.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("admin_logged_in"):
            return jsonify({"success": False, "message": "Admin login required"}), 401
        return f(*args, **kwargs)
    return decorated_function

def create_tables():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("CREATE TABLE IF NOT EXISTS admins (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) UNIQUE, password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        cur.execute("""CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY, order_number VARCHAR(50) UNIQUE, customer_name VARCHAR(150) NOT NULL,
            customer_email VARCHAR(150), customer_phone VARCHAR(30) NOT NULL, address TEXT, address_line VARCHAR(255) NOT NULL,
            city VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL, pincode VARCHAR(20) NOT NULL, items JSON NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL, razorpay_order_id VARCHAR(100), razorpay_payment_id VARCHAR(100),
            payment_status VARCHAR(30) DEFAULT 'Pending', order_status VARCHAR(30) DEFAULT 'Pending', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
        cur.execute("CREATE TABLE IF NOT EXISTS reviews (id INT AUTO_INCREMENT PRIMARY KEY, product_id INT NOT NULL, customer_name VARCHAR(100) NOT NULL, rating INT NOT NULL, review_text TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Tables ready")
    except Exception as e:
        print("Table error:", e)

@app.route("/")
def home():
    return jsonify({"success": True, "message": "Sarika Fashions backend running!", "razorpay": bool(razorpay_client)})

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip()
    password = str(data.get("password", ""))
    if email.lower()!= ADMIN_EMAIL.lower() or password!= ADMIN_PASSWORD:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401
    session["admin_logged_in"] = True
    session["admin_email"] = ADMIN_EMAIL
    return jsonify({"success": True, "admin": {"email": ADMIN_EMAIL}})

@app.route("/api/admin/me", methods=["GET"])
def admin_me():
    if not session.get("admin_logged_in"):
        return jsonify({"success": False, "logged_in": False}), 401
    return jsonify({"success": True, "logged_in": True, "admin": {"email": session.get("admin_email")}})

@app.route("/api/admin/logout", methods=["POST"])
def admin_logout():
    session.clear()
    return jsonify({"success": True})

# ============ FIXED PRODUCTS QUERY ============
@app.route("/api/products", methods=["GET"])
def get_products():
    conn = cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT p.id, p.name, p.category, p.price, p.old_price, p.image, p.description, p.stock, p.created_at, p.image2, p.image3, p.image4,
                   COALESCE(ROUND(AVG(r.rating),1),0) AS rating, COUNT(r.id) AS reviews
            FROM products p LEFT JOIN reviews r ON p.id = r.product_id
            GROUP BY p.id, p.name, p.category, p.price, p.old_price, p.image, p.description, p.stock, p.created_at, p.image2, p.image3, p.image4
            ORDER BY p.created_at DESC
        """)
        products = cur.fetchall()
        for p in products:
            if p.get("created_at"): p["created_at"] = p["created_at"].isoformat()
            p["price"] = float(p["price"] or 0)
            p["old_price"] = float(p["old_price"] or 0)
            p["rating"] = float(p["rating"] or 0)
            p["reviews"] = int(p["reviews"] or 0)
            p["stock"] = int(p["stock"] or 0)
        return jsonify({"success": True, "products": products})
    except Error as e:
        print("PRODUCTS ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cur: cur.close()
        if conn: conn.close()

@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM products WHERE id=%s", (product_id,))
    product = cur.fetchone()
    cur.close()
    conn.close()
    if not product: return jsonify({"success": False, "message": "Not found"}), 404
    if product.get("created_at"): product["created_at"] = product["created_at"].isoformat()
    return jsonify({"success": True, "product": product})

# ============ RAZORPAY ============
@app.route("/api/razorpay/key", methods=["GET"])
def get_razorpay_key():
    return jsonify({"key": RAZORPAY_KEY_ID, "key_id": RAZORPAY_KEY_ID})

@app.route("/api/payment/create-order", methods=["POST"])
def create_payment_order():
    try:
        if not razorpay_client: return jsonify({"error": "Razorpay keys missing"}), 500
        data = request.get_json() or {}
        amount = float(data.get("amount", 0))
        amount_paise = int(round(amount * 100))
        if amount_paise < 100: amount_paise = 100
        order = razorpay_client.order.create({"amount": amount_paise, "currency": "INR", "receipt": f"receipt_{int(datetime.now().timestamp())}", "payment_capture": 1})
        return jsonify({"success": True, "order": order, "order_id": order["id"], "amount": order["amount"], "currency": order["currency"], "key_id": RAZORPAY_KEY_ID, "key": RAZORPAY_KEY_ID})
    except Exception as e:
        print("RAZORPAY ERROR:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/payment/verify", methods=["POST"])
def verify_payment():
    try:
        data = request.get_json() or {}
        razorpay_client.utility.verify_payment_signature({'razorpay_order_id': data['razorpay_order_id'], 'razorpay_payment_id': data['razorpay_payment_id'], 'razorpay_signature': data['razorpay_signature']})
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

# ============ FIXED ORDERS INSERT ============
@app.route("/api/orders", methods=["POST"])
def create_order():
    conn = cur = None
    try:
        data = request.get_json() or {}
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT order_number FROM orders ORDER BY id DESC LIMIT 1")
        last = cur.fetchone()
        next_num = 1
        if last and last[0]:
            try: next_num = int(str(last[0]).replace("SF-", "")) + 1
            except: pass
        order_number = f"SF-{next_num:05d}"
        cur.execute("""
            INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, address, address_line, city, state, pincode, items, total_amount, razorpay_order_id, razorpay_payment_id, payment_status, order_status)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            order_number, data.get("customer_name"), data.get("customer_email"), data.get("customer_phone"),
            data.get("address",""), data.get("address_line",""), data.get("city",""), data.get("state",""), data.get("pincode",""),
            json.dumps(data.get("items", [])), float(data.get("total_amount", data.get("total", 0))),
            data.get("razorpay_order_id"), data.get("razorpay_payment_id"),
            data.get("payment_status", "Paid"), data.get("order_status", "Placed")
        ))
        conn.commit()
        return jsonify({"success": True, "order_id": cur.lastrowid, "order_number": order_number}), 201
    except Exception as e:
        if conn: conn.rollback()
        print("ORDER CREATE ERROR:", e)
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if cur: cur.close()
        if conn: conn.close()

@app.route("/api/orders", methods=["GET"])
@admin_required
def get_orders():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
    orders = cur.fetchall()
    for o in orders:
        if o.get("created_at"): o["created_at"] = o["created_at"].isoformat()
        if isinstance(o.get("items"), str):
            try: o["items"] = json.loads(o["items"])
            except: o["items"] = []
        o["total_amount"] = float(o.get("total_amount") or 0)
        o["total"] = o["total_amount"]
    cur.close()
    conn.close()
    return jsonify({"success": True, "orders": orders})

@app.route("/api/orders/track/<string:order_number>", methods=["GET"])
def track_order(order_number):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM orders WHERE order_number=%s", (order_number.strip().upper(),))
    order = cur.fetchone()
    cur.close()
    conn.close()
    if not order: return jsonify({"success": False, "message": "Order not found"}), 404
    if order.get("created_at"): order["created_at"] = order["created_at"].isoformat()
    if isinstance(order.get("items"), str):
        try: order["items"] = json.loads(order["items"])
        except: order["items"] = []
    return jsonify({"success": True, "order": order})

if __name__ == "__main__":
    create_tables()
    print("Backend at http://127.0.0.1:5000")
    app.run(debug=True, host="0.0.0.0", port=5000)