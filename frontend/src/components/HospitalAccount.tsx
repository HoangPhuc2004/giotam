import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Droplet, Search, Send } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { cn } from './ui/utils'; // Import cn

export default function HospitalAccount() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(!user?.name);
  const [hospitalFormData, setHospitalFormData] = useState({
    hospitalName: user?.name || '',
    address: user?.address || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

   useEffect(() => {
     if (user && (user.role === 'hospital' || user.role === 'admin')) {
       setHospitalFormData({
         hospitalName: user.name || '',
         address: user.address || '',
         phone: user.phone || '',
         email: user.email || '',
       });
       setIsEditing(!user.name);
     }
   }, [user]);

  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToUpdate = {
        name: hospitalFormData.hospitalName,
        address: hospitalFormData.address,
        phone: hospitalFormData.phone,
    };
    updateProfile({...dataToUpdate, id: user?.id}); 
    setIsEditing(false);
    toast.success('Cập nhật thông tin bệnh viện thành công!');
  };

  const handleHospitalChange = (field: string, value: string) => {
    setHospitalFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Phần hiển thị/chỉnh sửa thông tin bệnh viện */}
      <div className="flex justify-between items-center">
        <h1>Tài khoản Bệnh viện</h1>
        {user?.name && !isEditing && (
          <Button onClick={() => setIsEditing(true)} className="bg-[#930511] text-white hover:bg-[#7a0410]">Chỉnh sửa</Button>
        )}
      </div>
       <Card>
            <CardHeader>
                <CardTitle>{isEditing ? 'Cập nhật thông tin bệnh viện' : hospitalFormData.hospitalName || 'Thông tin bệnh viện'}</CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <form onSubmit={handleHospitalSubmit} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                            <Label htmlFor="hospitalName">Tên bệnh viện</Label>
                            <Input id="hospitalName" value={hospitalFormData.hospitalName} onChange={(e) => handleHospitalChange('hospitalName', e.target.value)} required className="mt-2"/>
                            </div>
                            <div className="md:col-span-2">
                            <Label htmlFor="hospitalAddress">Địa chỉ</Label>
                            <Input id="hospitalAddress" value={hospitalFormData.address} onChange={(e) => handleHospitalChange('address', e.target.value)} required className="mt-2"/>
                            </div>
                            <div>
                            <Label htmlFor="hospitalPhone">Số điện thoại</Label>
                            <Input id="hospitalPhone" type="tel" value={hospitalFormData.phone} onChange={(e) => handleHospitalChange('phone', e.target.value)} required className="mt-2"/>
                            </div>
                             <div>
                                <Label htmlFor="hospitalEmail">Email (Không thể thay đổi)</Label>
                                <Input id="hospitalEmail" type="email" value={hospitalFormData.email} readOnly disabled className="mt-2 bg-gray-100 cursor-not-allowed"/>
                             </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" className="bg-[#930511] text-white hover:bg-[#7a0410]">Lưu thông tin</Button>
                            {user?.name && <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>}
                        </div>
                    </form>
                ) : (
                     <div className="space-y-4">
                        <div><p className="text-sm text-gray-600">Địa chỉ</p><div className="flex items-start gap-2 mt-1"><MapPin className="w-4 h-4 mt-1 text-[#930511]" /> <p>{hospitalFormData.address || 'Chưa cập nhật'}</p></div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><p className="text-sm text-gray-600">Số điện thoại</p><p className="mt-1">{hospitalFormData.phone || 'Chưa cập nhật'}</p></div>
                            <div><p className="text-sm text-gray-600">Email</p><p className="mt-1">{hospitalFormData.email}</p></div>
                        </div>
                     </div>
                )}
            </CardContent>
        </Card>

      {/* Phần tìm kiếm tình nguyện viên ĐÃ ĐƯỢC CHUYỂN SANG TRANG CHỦ THEO YÊU CẦU */}
    </div>
  );
}