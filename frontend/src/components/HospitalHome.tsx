import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { MapPin, Phone, Droplet, Search, Send, Calendar, Clock, HeartPulse } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { cn } from './ui/utils';
import api from '../api/api';

// Định nghĩa kiểu dữ liệu trả về từ API /create_alert
interface DonorSearchResult {
    user: {
        id: number;
        name: string;
        phone: string;
        email?: string;
        blood_type: string;
    };
    distance_km: number;
    ai_score: number;
}

export default function HospitalHome() {
  const { user } = useAuth();
  
  // --- State cho chức năng lọc ---
  const [filters, setFilters] = useState({
    bloodType: 'O+',
    radius: '10',
  });
  const [searchResults, setSearchResults] = useState<DonorSearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedDonors, setSelectedDonors] = useState<number[]>([]);

  // --- State cho chức năng tạo Yêu cầu Hiến máu ---
  const [requestData, setRequestData] = useState({
    bloodType: 'O+',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    timeSlot: '08:00 - 09:00',
    amountMl: '350',
    urgency: 'normal'
  });
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);

  // --- HÀM TẠO YÊU CẦU HIẾN MÁU ---
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingRequest(true);
    
    // Gọi API để tạo Yêu cầu hiến máu
    try {
      // payload data matches typical Backend /blood-requests POST structure
      const payload = {
        hospital_id: user?.id,
        blood_type: requestData.bloodType,
        amount_ml: parseInt(requestData.amountMl, 10),
        urgency: requestData.urgency,
        expected_date: requestData.date,
        time_slot: requestData.timeSlot,
        status: 'open'
      };
      
      const res = await api.post('/blood-requests', payload);
      
      toast.success('Tạo yêu cầu kêu gọi hiến máu thành công!');
      // Reset về giá trị mặc định sau khi gửi
      setRequestData({
        ...requestData,
        bloodType: 'O+',
        amountMl: '350',
        urgency: 'normal'
      });
    } catch (error: any) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi tạo yêu cầu. ' + (error.response?.data?.error || error.message));
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const handleRequestChange = (field: string, value: string) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  // --- HÀM GỌI API /create_alert (TÌM KIẾM TNV) ---
  const handleSearchDonors = async () => {
       setIsLoadingSearch(true);
       setSearchError(null);
       setSearchResults([]);
       setSelectedDonors([]);

       const hospitalId = user?.id || 1;

       const searchPayload = {
           hospital_id: hospitalId,
           blood_type: filters.bloodType,
           radius_km: parseInt(filters.radius, 10),
       };

       try {
           const response = await fetch(`${import.meta.env.VITE_API_URL}/create_alert`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(searchPayload),
           });

           const result = await response.json();
           if (!response.ok) throw new Error(result.error || `Lỗi ${response.status}`);

           setSearchResults(result.top_50_users || []);
           if (!result.top_50_users || result.top_50_users.length === 0) {
              toast.info("Không tìm thấy tình nguyện viên phù hợp.");
           } else {
              toast.success(`Tìm thấy ${result.top_50_users.length} tình nguyện viên.`);
           }

       } catch (error: any) {
           console.error("Search donors API call failed:", error);
           setSearchError(`Lỗi tìm kiếm: ${error.message}`);
           toast.error(`Lỗi tìm kiếm: ${error.message}`);
       } finally {
           setIsLoadingSearch(false);
       }
   };
   
  const handleSelectDonor = (checked: boolean | 'indeterminate', donorId: number) => {
    setSelectedDonors(prev => {
      if (checked) {
        return [...prev, donorId];
      } else {
        return prev.filter(id => id !== donorId);
      }
    });
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedDonors(searchResults.map(result => result.user.id));
    } else {
      setSelectedDonors([]);
    }
  };

  const handleBulkContact = async () => {
    if (selectedDonors.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người để gửi thông báo.");
      return;
    }

    setIsLoadingSearch(true);
    
    // Tạo nội dung tin nhắn khẩn cấp
    const hospitalName = user?.name || "Bệnh viện";
    const hospitalAddress = user?.address || "địa chỉ bệnh viện (vui lòng xem trên website)";
    const bloodTypeNeeded = filters.bloodType;

    const messageBody = `[GIOT AM] KHẨN CẤP! Bệnh viện ${hospitalName} đang cần gấp nhóm máu ${bloodTypeNeeded}. Nếu bạn sẵn sàng, xin vui lòng đến hiến máu tại: ${hospitalAddress}. Trân trọng cảm ơn!`;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notify_donors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donor_ids: selectedDonors,
            message: messageBody
          }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Lỗi không xác định');

      toast.success(result.message || 'Đã gửi yêu cầu thông báo thành công.');
      setSelectedDonors([]);

    } catch (error: any) {
      console.error("Bulk notify API call failed:", error);
      toast.error(`Gửi thông báo thất bại: ${error.message}`);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const isAllSelected = searchResults.length > 0 && selectedDonors.length === searchResults.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-serif">
      
      {/* 1. Phần Tạo yêu cầu hiến máu */}
      <Card className="border-t-4 border-t-[#930511] shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-white border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-[#930511] text-2xl">
            <HeartPulse className="w-6 h-6" />
            Tạo yêu cầu kêu gọi hiến máu
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Phát hành yêu cầu hiến máu công khai. Các tình nguyện viên sẽ có thể nhìn thấy và Đăng ký tham gia vào lịch được phân bố.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleCreateRequest} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="req_date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" /> Ngày tiếp nhận
                </Label>
                <Input 
                  id="req_date" 
                  type="date" 
                  value={requestData.date} 
                  onChange={(e) => handleRequestChange('date', e.target.value)} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="req_time" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" /> Khung giờ
                </Label>
                <Select value={requestData.timeSlot} onValueChange={(val) => handleRequestChange('timeSlot', val)}>
                  <SelectTrigger className="bg-white" id="req_time">
                    <SelectValue placeholder="Chọn khung giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00 - 09:00">08:00 - 09:00</SelectItem>
                    <SelectItem value="09:00 - 10:00">09:00 - 10:00</SelectItem>
                    <SelectItem value="10:00 - 11:00">10:00 - 11:00</SelectItem>
                    <SelectItem value="13:00 - 14:00">13:00 - 14:00</SelectItem>
                    <SelectItem value="14:00 - 15:00">14:00 - 15:00</SelectItem>
                    <SelectItem value="15:00 - 16:00">15:00 - 16:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req_blood" className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-[#930511]" /> Nhóm máu
                </Label>
                <Select value={requestData.bloodType} onValueChange={(val) => handleRequestChange('bloodType', val)}>
                  <SelectTrigger className="bg-white" id="req_blood">
                    <SelectValue placeholder="Chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="Khác">Tất cả nhóm máu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req_amount">Thể tích (ml)</Label>
                <Select value={requestData.amountMl} onValueChange={(val) => handleRequestChange('amountMl', val)}>
                  <SelectTrigger className="bg-white" id="req_amount">
                    <SelectValue placeholder="Chọn dung tích" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="250">250 ml</SelectItem>
                    <SelectItem value="350">350 ml</SelectItem>
                    <SelectItem value="450">450 ml</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button 
                type="submit" 
                disabled={isCreatingRequest}
                className="bg-[#930511] text-white hover:bg-[#7a0410] px-8 h-12 text-lg font-bold rounded-xl"
              >
                {isCreatingRequest ? 'Đang tạo...' : 'Tạo Yêu Cầu Ghi Nhận'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Phần tìm kiếm tình nguyện viên (Gửi SMS qua AI) */}
      <Card className="shadow-md">
        <CardHeader className="bg-[#FBF2E1] border-b pb-4 rounded-t-xl">
          <CardTitle className="text-xl">Tìm kiếm Tình nguyện viên Khẩn cấp (AI)</CardTitle>
          <p className="text-sm text-gray-700 mt-2">
            Đề xuất những người hiến máu đủ điều kiện trong bán kính gần bệnh viện để gửi thông báo ưu tiên.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="bloodTypeFilter">Nhóm máu cần tìm</Label>
                <Select value={filters.bloodType} onValueChange={(value) => handleFilterChange('bloodType', value)}>
                  <SelectTrigger className="mt-2 bg-white" id="bloodTypeFilter">
                    <SelectValue placeholder="Chọn nhóm máu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="radiusFilter">Bán kính (km)</Label>
                <Select value={filters.radius} onValueChange={(value) => handleFilterChange('radius', value)}>
                  <SelectTrigger className="mt-2 bg-white" id="radiusFilter">
                    <SelectValue placeholder="Chọn bán kính" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10, 15, 20].map(r => (
                        <SelectItem key={r} value={String(r)}>{r} km</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSearchDonors}
                disabled={isLoadingSearch}
                className="w-full h-10 bg-black text-white hover:bg-gray-800"
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoadingSearch ? 'Đang tìm...' : 'Quét Radar Tìm kiếm'}
              </Button>
            </div>

            {searchError && <p className="text-red-600 font-medium">{searchError}</p>}

            {/* Results actions */}
            {searchResults.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="font-medium cursor-pointer">
                    {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"} ({selectedDonors.length} / {searchResults.length})
                  </Label>
                </div>
                
                <Button
                  onClick={handleBulkContact}
                  disabled={isLoadingSearch || selectedDonors.length === 0}
                  className="w-full sm:w-auto bg-[#930511] text-white hover:bg-[#7a0410]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Gửi thông báo cho ({selectedDonors.length}) người
                </Button>
              </div>
            )}

            {/* Result List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {isLoadingSearch && <p className="text-center text-gray-500 py-4">Đang dò tìm tình nguyện viên...</p> }
              
              {!isLoadingSearch && searchResults.length === 0 && !searchError && (
                 <p className="text-center text-gray-500 py-8 italic border-2 border-dashed rounded-xl">Chưa có kết quả tìm kiếm.</p>
              )}

              {!isLoadingSearch && searchResults.map((result) => (
                <div
                  key={result.user.id}
                  className={cn(
                    "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-all gap-3 border",
                    selectedDonors.includes(result.user.id) ? "border-[#930511] bg-[#fdf2f3]" : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      id={`donor-${result.user.id}`}
                      checked={selectedDonors.includes(result.user.id)}
                      onCheckedChange={(checked) => handleSelectDonor(checked, result.user.id)}
                      className="shrink-0"
                    />
                    <Label htmlFor={`donor-${result.user.id}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#930511] shrink-0 font-bold">
                          {result.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900">{result.user.name}</h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{result.user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 sm:pl-4">
                    <div className="text-left sm:text-right flex-1 sm:flex-initial">
                       <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#930511]/10 text-[#930511] rounded-full mb-1">
                          <Droplet className="w-3 h-3" />
                          <span className="text-sm font-bold">{result.user.blood_type}</span>
                       </div>
                       <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 justify-start sm:justify-end mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>~{result.distance_km.toFixed(1)} km</span>
                          <span className="text-gray-400 text-xs">(Độ ưu tiên: {result.ai_score.toFixed(2)})</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
