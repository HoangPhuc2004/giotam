import { useState } from 'react';
import { X, Clock, MapPin, Droplets, CheckCircle } from 'lucide-react';
import { api } from '../api';

interface BloodRequest {
  id: number;
  hospital_name: string;
  hospital_address: string;
  blood_type: string;
  amount_ml: number;
  urgency: string;
  note?: string;
}

interface TimeSlotModalProps {
  request: BloodRequest;
  donorId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00',
  '11:00', '13:00', '14:00', '15:00',
];

export function TimeSlotModal({ request, donorId, onClose, onSuccess }: TimeSlotModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/blood-requests/${request.id}/register`, {
        donor_id: donorId,
        time_slot: selectedSlot,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Có lỗi xảy ra, vui lòng thử lại.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const urgencyColor =
    request.urgency === 'Khẩn cấp'
      ? 'bg-red-600'
      : request.urgency === 'Cần gấp'
      ? 'bg-orange-500'
      : 'bg-green-500';

  return (
    /* Overlay */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: '430px',
          padding: '24px 20px 36px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Chọn khung giờ hiến máu</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={22} color="#666" />
          </button>
        </div>

        {/* Request info */}
        <div style={{ backgroundColor: '#FBF2E1', borderRadius: 16, padding: '16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 28, fontWeight: 800, color: '#8B0000', lineHeight: 1,
            }}>{request.blood_type}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#fff', backgroundColor: '#8B0000',
              borderRadius: 20, padding: '3px 10px',
            }}>{request.urgency}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
            <MapPin size={14} color="#8B0000" style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{request.hospital_name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{request.hospital_address}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <Droplets size={14} color="#8B0000" />
            <span style={{ fontSize: 13, color: '#555' }}>Cần <strong>{request.amount_ml}ml</strong> máu</span>
          </div>
          {request.note ? (
            <div style={{ fontSize: 12, color: '#777', marginTop: 8, fontStyle: 'italic' }}>
              📝 {request.note}
            </div>
          ) : null}
        </div>

        {success ? (
          /* Thành công */
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={56} color="#22c55e" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#15803d', marginBottom: 6 }}>
              Đăng ký thành công!
            </div>
            <div style={{ fontSize: 13, color: '#555' }}>
              Bạn đăng ký khung giờ <strong>{selectedSlot}</strong>.<br />
              Cảm ơn bạn đã đồng hành cùng Giọt Ấm 💖 (+10 điểm)
            </div>
          </div>
        ) : (
          <>
            {/* Chọn giờ */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Clock size={16} color="#8B0000" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Chọn khung giờ</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 12,
                      border: selectedSlot === slot ? '2px solid #8B0000' : '2px solid #e5e7eb',
                      backgroundColor: selectedSlot === slot ? '#8B0000' : '#fff',
                      color: selectedSlot === slot ? '#fff' : '#374151',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 10,
                padding: '10px 14px', fontSize: 13, marginBottom: 14,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Nút xác nhận */}
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot || isLoading}
              style={{
                width: '100%',
                backgroundColor: selectedSlot ? '#8B0000' : '#d1d5db',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '14px',
                fontSize: 16,
                fontWeight: 700,
                cursor: selectedSlot ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s',
              }}
            >
              {isLoading ? 'Đang đăng ký...' : selectedSlot ? `Xác nhận - ${selectedSlot}` : 'Chọn khung giờ trước'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
