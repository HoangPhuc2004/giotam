import os
import smtplib  # Thư viện gửi mail
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS
from dateutil.parser import parse

# Import geocoding MIỄN PHÍ (File geocoding_free.py phải nằm cùng thư mục)
from geocoding_free import geocode_address

# --- KHỞI TẠO VÀ CẤU HÌNH ---
app = Flask(__name__)
# Cấu hình CORS - liệt kê rõ các domain được phép gọi API
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://giotam.vercel.app",
    "https://giotam-frontend.vercel.app",
    "https://giotam-mobile.vercel.app",
]
cors = CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

# --- DATABASE ---
# Ưu tiên dùng DATABASE_URL từ môi trường (Render.com cung cấp)
# Nếu không có thì fallback về SQLite cho dev local
DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Render cung cấp URL dạng postgres:// nhưng SQLAlchemy cần postgresql://
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

if DATABASE_URL:
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
else:
    # Local development - dùng SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blood.db'
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'connect_args': {
            'timeout': 30,
            'check_same_thread': False
        },
        'pool_pre_ping': True,
        'pool_recycle': 3600,
    }

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# --- CẤU HÌNH EMAIL HỆ THỐNG ---
# Đọc từ environment variables (ưu tiên) hoặc fallback sang giá trị mặc định
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'minhtuandoanxxx@gmail.com')
APP_PASSWORD = os.environ.get('APP_PASSWORD', 'mavn ohfr xwtz cvgg')

# URL công khai của server (ngrok hoặc IP thực).
# Thay đổi dòng này thành ngrok URL của bạn khi dùng điện thoại thực.
# Ví dụ: BASE_URL = "https://arletta-unfavoured-immemorially.ngrok-free.dev"
BASE_URL = "https://arletta-unfavoured-immemorially.ngrok-free.dev"  # ngrok URL của bạn




# --- MODELS (CƠ SỞ DỮ LIỆU) ---
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, default='')
    phone = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='donor')
    address = db.Column(db.String(200), nullable=True)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    blood_type = db.Column(db.String(5), nullable=True)
    last_donation = db.Column(db.Date, nullable=True)
    donations_count = db.Column(db.Integer, default=0)
    reward_points = db.Column(db.Integer, default=0)
    donation_records = db.relationship('DonationRecord', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'role': self.role,
            'address': self.address,
            'lat': self.lat,
            'lng': self.lng,
            'blood_type': self.blood_type,
            'last_donation': self.last_donation.isoformat() if self.last_donation else None,
            'donations_count': self.donations_count,
            'reward_points': self.reward_points
        }

class Hospital(db.Model):
    __tablename__ = 'hospitals'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)

    def to_dict(self):
         return {'id': self.id, 'name': self.name, 'lat': self.lat, 'lng': self.lng }

class DonationRecord(db.Model):
    __tablename__ = 'donation_records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    donation_date = db.Column(db.Date, nullable=False)
    amount_ml = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='completed')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'donation_date': self.donation_date.isoformat() if self.donation_date else None,
            'amount_ml': self.amount_ml,
            'status': self.status
        }


# --- CÁC API ROUTE CƠ BẢN ---

@app.route('/')
def index():
    return jsonify({'message': 'Blood Donation API is running!'})

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify({'count': len(users), 'users': [user.to_dict() for user in users]})

@app.route('/hospitals', methods=['GET'])
def get_hospitals():
    hospitals = Hospital.query.all()
    return jsonify({'count': len(hospitals), 'hospitals': [h.to_dict() for h in hospitals]})


# --- ĐĂNG KÝ & ĐĂNG NHẬP ---

@app.route('/register_donor', methods=['POST'])
def register_donor():
    data = request.get_json()

    # Validate thông tin
    required_fields = ['fullName', 'email', 'phone', 'password', 'address', 'bloodType']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({'error': 'Thiếu thông tin bắt buộc hoặc thông tin rỗng'}), 400

    # Kiểm tra trùng lặp
    if User.query.filter((User.email == data['email']) | (User.phone == data['phone'])).first():
         return jsonify({'error': 'Email hoặc số điện thoại đã tồn tại'}), 409

    # Xử lý địa chỉ -> tọa độ (Geocoding)
    address = data['address']
    lat, lng = None, None
    try:
        coords = geocode_address(address)
        if coords:
            lat, lng = coords
            print(f"✅ Geocoding thành công: {lat}, {lng}")
        else:
            print(f"⚠️ Không tìm thấy tọa độ cho '{address}'")
    except Exception as e:
        print(f"❌ Lỗi geocoding: {e}")

    # Xử lý ngày hiến máu
    last_donation_date = None
    if data.get('lastDonationDate'):
        date_str = data['lastDonationDate']
        if date_str:
            try:
                last_donation_date = parse(date_str).date()
            except (ValueError, TypeError):
                 return jsonify({'error': 'Định dạng ngày không hợp lệ'}), 400

    # Tạo user mới
    new_user = User(
        name=data['fullName'],
        email=data['email'],
        phone=data['phone'],
        password=data['password'], 
        role='donor',
        address=address,
        lat=lat,
        lng=lng,
        blood_type=data['bloodType'],
        last_donation=last_donation_date
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        user_dict = new_user.to_dict()
        
        msg = 'Đăng ký thành công'
        if lat is None:
             msg += ' (nhưng chưa xác định được tọa độ)'
        
        return jsonify({'message': msg, 'user': user_dict}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Lỗi DB: {e}")
        return jsonify({'error': 'Lỗi máy chủ nội bộ'}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Thiếu email hoặc mật khẩu'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.password == data['password']:
        return jsonify({'message': 'Đăng nhập thành công', 'user': user.to_dict()}), 200
    else:
        # Trả về 401 để Frontend bắt lỗi hiển thị bảng đỏ
        return jsonify({'error': 'Email hoặc mật khẩu không chính xác'}), 401


# --- TÍNH NĂNG LỌC TÌNH NGUYỆN VIÊN (AI FILTER) ---

@app.route('/create_alert', methods=['POST'])
def create_alert():
    data = request.get_json()
    
    if not data.get('hospital_id') or not data.get('blood_type'):
        return jsonify({'error': 'Thiếu thông tin bệnh viện hoặc nhóm máu'}), 400
        
    # Tìm bệnh viện từ bảng users (role='hospital')
    hospital_user = User.query.filter_by(id=data['hospital_id'], role='hospital').first()
    # Nếu không tìm thấy, thử admin (để admin cũng có thể test)
    if not hospital_user:
        hospital_user = User.query.filter_by(id=data['hospital_id']).first()
    if not hospital_user:
        return jsonify({'error': 'Không tìm thấy bệnh viện'}), 404

    # Tạo object tương thích với ai_filter (cần lat, lng, name)
    class HospitalProxy:
        def __init__(self, user):
            self.id = user.id
            self.name = user.name
            self.lat = user.lat or 16.0544068  # Default: Đà Nẵng
            self.lng = user.lng or 108.2021667
        def to_dict(self):
            return {'id': self.id, 'name': self.name, 'lat': self.lat, 'lng': self.lng}

    hospital = HospitalProxy(hospital_user)
        
    blood_type_needed = data['blood_type']
    radius_km = data.get('radius_km', 10)
    
    # Lấy danh sách donor phù hợp sơ bộ (cùng nhóm máu)
    # Không yêu cầu lat/lng để không bỏ sót donor chưa có tọa độ
    suitable_users = User.query.filter(
        User.role == 'donor',
        User.blood_type == blood_type_needed
    ).all()

    # Thử geocode cho donor chưa có tọa độ
    for u in suitable_users:
        if u.lat is None and u.address:
            try:
                coords = geocode_address(u.address)
                if coords:
                    u.lat, u.lng = coords
                    db.session.commit()
            except Exception:
                pass
    
    try:
        # Gọi thuật toán lọc (file ai_filter.py)
        from ai_filter import filter_nearby_users
        results = filter_nearby_users(hospital, suitable_users, radius_km)
        
        # Lấy top 50
        top_50_users = results[:50]
        
        return jsonify({
            'hospital': hospital.to_dict(),
            'blood_type_needed': blood_type_needed,
            'total_matched': len(results),
            'top_50_users': [
                {
                    'user': r['user'].to_dict(), 
                    'distance_km': r['distance'], 
                    'ai_score': r['ai_score']
                }
                for r in top_50_users
            ]
        })
    except ImportError:
        return jsonify({'error': "Thiếu file ai_filter.py"}), 500
    except Exception as e:
        print(f"Lỗi AI Filter: {e}")
        return jsonify({'error': 'Lỗi xử lý lọc người dùng'}), 500


@app.route('/users/<int:user_id>', methods=['PUT', 'PATCH'])
def update_user_profile(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    allowed_fields = ['name', 'phone', 'address', 'blood_type', 'last_donation', 'lat', 'lng', 'reward_points']
    
    geocoding_needed = False
    old_address = user.address
    
    for field in allowed_fields:
        if field in data:
            if field == 'last_donation':
                if data[field]:
                    try:
                        setattr(user, field, parse(data[field]).date())
                    except: pass
                else:
                     setattr(user, field, None)
            else:
                 setattr(user, field, data[field])
            
            if field == 'address' and data[field] != old_address:
                geocoding_needed = True

    if geocoding_needed and user.address:
        try:
            coords = geocode_address(user.address)
            if coords:
                user.lat, user.lng = coords
        except Exception: pass

    try:
        db.session.commit()
        return jsonify({'message': 'Cập nhật thành công', 'user': user.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Lỗi cập nhật'}), 500

@app.route('/users/<int:user_id>/history', methods=['GET'])
def get_user_donation_history(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Không tìm thấy người dùng'}), 404
        
    records = DonationRecord.query.filter_by(user_id=user_id).order_by(DonationRecord.donation_date.desc()).all()
    return jsonify({
        'count': len(records),
        'history': [r.to_dict() for r in records]
    }), 200


# --- GỬI EMAIL HTML CHO TÌNH NGUYỆN VIÊN ---

@app.route('/notify_donors', methods=['POST'])
def notify_donors():
    import threading
    data = request.get_json()
    donor_ids = data.get('donor_ids')
    message_body = data.get('message')

    if not donor_ids or not message_body:
        return jsonify({'error': 'Thiếu ID người nhận hoặc nội dung'}), 400

    try:
        users_to_notify = User.query.filter(User.id.in_(donor_ids)).all()
        
        # Tạo DonationRecord PENDING đồng bộ trước khi trả response
        for user in users_to_notify:
            if user.email:
                new_pending = DonationRecord(
                    user_id=user.id,
                    donation_date=datetime.now().date(),
                    amount_ml=0,
                    status='pending'
                )
                db.session.add(new_pending)
        db.session.commit()

        # Gửi email trong background thread để không block HTTP response
        user_data = [(u.email, u.name, u.blood_type, u.id) for u in users_to_notify if u.email]

        def send_emails_background(user_data, message_body):
            try:
                print("🔌 Đang kết nối Gmail SSL (background)...")
                server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=60)
                server.login(SENDER_EMAIL, APP_PASSWORD)
                print("✅ Kết nối thành công!")

                for email, name, blood_type, uid in user_data:
                    try:
                        msg = MIMEMultipart()
                        msg['From'] = SENDER_EMAIL
                        msg['To'] = email
                        msg['Subject'] = f"🩸 KHẨN CẤP: CẦN MÁU NHÓM {blood_type} - GIỌT ẤM"

                        html_body = f"""
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }}
                                .email-container {{ max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }}
                                .header {{ background-color: #930511; color: #ffffff; padding: 20px; text-align: center; }}
                                .header h1 {{ margin: 0; }}
                                .content {{ padding: 25px; }}
                                .alert-box {{ background-color: #fbe4e6; border-left: 5px solid #930511; padding: 15px; margin: 20px 0; }}
                                .alert-title {{ color: #930511; font-weight: bold; margin-top: 0; }}
                                .footer {{ background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #888; }}
                            </style>
                        </head>
                        <body>
                            <div class="email-container">
                                <div class="header">
                                    <h1>🩸 GIỌT ẤM</h1>
                                    <p>Kết nối yêu thương - Sẻ chia sự sống</p>
                                </div>
                                <div class="content">
                                    <p>Xin chào <strong>{name}</strong>,</p>
                                    <p>Hệ thống <strong>Giọt Ấm</strong> vừa nhận được thông báo khẩn cấp:</p>
                                    <div class="alert-box">
                                        <p class="alert-title">📢 THÔNG BÁO CẦN MÁU</p>
                                        <p>{message_body}</p>
                                    </div>
                                    <p>Sự giúp đỡ của bạn có thể cứu sống một mạng người. Hãy đến bệnh viện sớm nhất nếu có thể.</p>
                                    <p>Trân trọng,<br>Đội ngũ Giọt Ấm</p>
                                </div>
                                <div class="footer">
                                    <p>Email tự động từ hệ thống Giọt Ấm.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """
                        msg.attach(MIMEText(html_body, 'html'))
                        server.send_message(msg)
                        print(f"✅ Đã gửi cho {name} ({email})")
                    except Exception as e:
                        print(f"⚠️ Lỗi gửi {name}: {e}")

                server.quit()
                print("📨 Hoàn tất gửi email background!")
            except Exception as e:
                print(f"❌ Lỗi SMTP background: {e}")

        thread = threading.Thread(target=send_emails_background, args=(user_data, message_body), daemon=True)
        thread.start()

        return jsonify({
            'message': f'Đã tạo {len(user_data)} yêu cầu chờ. Email đang được gửi trong nền.',
            'count': len(user_data)
        }), 200

    except Exception as e:
        print(f"❌ Lỗi notify_donors: {e}")
        return jsonify({'error': f'Lỗi hệ thống: {str(e)}'}), 500


# --- XỬ LÝ FORM LIÊN HỆ (GỬI VỀ ADMIN) ---

@app.route('/contact_support', methods=['POST'])
def contact_support():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    message = data.get('message')

    if not all([name, email, phone, message]):
        return jsonify({'error': 'Vui lòng điền đầy đủ thông tin'}), 400

    # Email nhận thư (Gửi về chính Admin)
    RECEIVER_EMAIL = SENDER_EMAIL 

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(SENDER_EMAIL, APP_PASSWORD)

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECEIVER_EMAIL
        msg['Subject'] = f"🔔 [LIÊN HỆ] Tin nhắn mới từ {name}"

        body = f"""
        Xin chào Admin Giọt Ấm,

        Bạn có một liên hệ mới từ website:
        ------------------------------------------------
        👤 Người gửi: {name}
        📧 Email: {email}
        📞 SĐT: {phone}
        ------------------------------------------------
        📝 Nội dung tin nhắn:
        {message}
        ------------------------------------------------
        """
        msg.attach(MIMEText(body, 'plain'))

        server.send_message(msg)
        server.quit()

        print(f"✅ Đã nhận liên hệ từ {name}")
        return jsonify({'message': 'Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn.'}), 200

    except Exception as e:
        print(f"❌ Lỗi gửi mail liên hệ: {e}")
        return jsonify({'error': 'Lỗi hệ thống gửi mail'}), 500


# --- XÁC NHẬN THAM GIA TỪ EMAIL ---
@app.route('/participate', methods=['GET'])
def participate():
    user_id = request.args.get('user_id')
    if not user_id:
        return "Thiếu thông tin tình nguyện viên.", 400
        
    user = User.query.get(user_id)
    if not user:
        return "Không tìm thấy tình nguyện viên.", 404
        
    # Tìm record pending gần nhất của user này (vừa được tạo khi gửi mail)
    record = DonationRecord.query.filter_by(user_id=user.id, status='pending').order_by(DonationRecord.id.desc()).first()
    
    if record:
        record.status = 'accepted'
    else:
        # Nếu không thấy (có thể do lỗi db lúc gửi mail), tạo mới với status accepted luôn
        record = DonationRecord(
            user_id=user.id,
            donation_date=datetime.now().date(),
            amount_ml=0,
            status='accepted'
        )
        db.session.add(record)
    
    db.session.commit()
    
    return f"""
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Xác nhận tham gia</title>
        <style>
            body {{ font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9; }}
            .container {{ background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }}
            h1 {{ color: #930511; }}
            p {{ font-size: 18px; color: #333; }}
            .success-icon {{ font-size: 50px; color: green; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✔️</div>
            <h1>Cảm ơn bạn, {user.name}!</h1>
            <p>Sự sẵn sàng của bạn là vô giá. Chúng tôi đã ghi nhận phản hồi của bạn và tặng bạn 10 điểm thưởng.</p>
            <p>Vui lòng di chuyển đến bệnh viện trong thời gian sớm nhất.</p>
        </div>
    </body>
    </html>
    """, 200

# --- ADMIN API: DANH SÁCH PENDING & XÁC NHẬN ---
@app.route('/admin/pending_donations', methods=['GET'])
def get_pending_donations():
    # Chỉ lấy những người ĐÃ XÁC NHẬN qua email (status='accepted')
    records = DonationRecord.query.filter_by(status='accepted').all()
    results = []
    for r in records:
        user = User.query.get(r.user_id)
        if user:
            results.append({
                'record_id': r.id,
                'user_name': user.name,
                'phone': user.phone,
                'blood_type': user.blood_type,
                'donation_date': r.donation_date.isoformat() if r.donation_date else None
            })
    return jsonify({'count': len(results), 'pending_donations': results}), 200

@app.route('/admin/confirm_donation/<int:record_id>', methods=['POST'])
def confirm_donation(record_id):
    data = request.get_json()
    amount_ml = data.get('amount_ml')

    if amount_ml is None or not isinstance(amount_ml, int) or amount_ml <= 0:
        return jsonify({'error': 'Lượng máu không hợp lệ'}), 400

    record = DonationRecord.query.get(record_id)
    if not record:
        return jsonify({'error': 'Không tìm thấy record'}), 404
        
    if record.status == 'completed':
        return jsonify({'error': 'Record này đã được xác nhận từ trước'}), 400

    user = User.query.get(record.user_id)
    if not user:
        return jsonify({'error': 'Không tìm thấy User của record này'}), 404

    try:
        # Cập nhật record
        record.status = 'completed'
        record.amount_ml = amount_ml
        
        # Cập nhật user
        user.donations_count += 1
        user.last_donation = datetime.now().date()
        user.reward_points += 50 # Tặng thêm điểm khi hoàn thành hiến máu thực tế
        
        db.session.commit()
        
        return jsonify({
            'message': 'Xác nhận hiến máu thành công',
            'record': record.to_dict(),
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Lỗi Admin Confirm: {e}")
        return jsonify({'error': 'Lỗi hệ thống khi xác nhận'}), 500


# --- CHẠY APP ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)