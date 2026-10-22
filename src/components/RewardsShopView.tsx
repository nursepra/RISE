import React, { useState } from 'react';
import {
  Gift,
  Award,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Truck,
  ShieldCheck,
  Flame,
  ArrowRight,
  X,
  History,
} from 'lucide-react';
import { RedeemedItem, Reward, UserProfile } from '../types';
import { REWARDS_CATALOG } from '../data/rewardsAndPlannerData';

interface RewardsShopViewProps {
  userProfile: UserProfile;
  redeemedItems: RedeemedItem[];
  onRedeemReward: (reward: Reward, shippingAddress?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const RewardsShopView: React.FC<RewardsShopViewProps> = ({
  userProfile,
  redeemedItems,
  onRedeemReward,
  onNavigateTab,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'physical' | 'digital' | 'history'>('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemSuccessItem, setRedeemSuccessItem] = useState<{
    reward: Reward;
    code?: string;
    isPhysical: boolean;
  } | null>(null);

  const filteredRewards = REWARDS_CATALOG.filter((r) => {
    if (filterCategory === 'physical') return r.category === 'physical';
    if (filterCategory === 'digital') return r.category === 'digital';
    return true;
  });

  const handleStartRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setShippingName(userProfile.name);
    setShippingPhone('081-234-5678');
    setShippingAddress('123/45 ถนนพญาไท แขวงวังใหม่ เขตปทุมวัน กรุงเทพฯ 10330');
  };

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;

    if (selectedReward.category === 'physical') {
      const fullAddress = `${shippingName} (โทร: ${shippingPhone}) ที่อยู่: ${shippingAddress}`;
      onRedeemReward(selectedReward, fullAddress);
      setRedeemSuccessItem({
        reward: selectedReward,
        isPhysical: true,
      });
    } else {
      const generatedCode = `RISE-${selectedReward.title.slice(0, 3).toUpperCase()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      onRedeemReward(selectedReward);
      setRedeemSuccessItem({
        reward: selectedReward,
        code: generatedCode,
        isPhysical: false,
      });
    }

    setSelectedReward(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Wallet Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFE5EC] via-[#FFF0F4] to-white border border-[#FFC2D1] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
              RISE REWARDS & GAMIFICATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              สะสมแต้มจากการเรียนรู้ & แลกรับของรางวัล
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              เปลี่ยนทุกการฝึกฝนและพัฒนาการคะแนนให้เป็นของรางวัลจริง ทั้งของใช้สไตล์มินิมอล ร่ม แก้วน้ำ กระเป๋า และคูปองร้านหนังสือ
            </p>
          </div>

          {/* Current Points Balance Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#FFC2D1] shadow-sm flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FB6F92] to-[#FF8FAB] flex items-center justify-center text-white shadow-sm">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">ยอดแต้มสะสมของคุณ</span>
              <span className="text-2xl font-black text-[#C23259] tabular-nums">
                {userProfile.points.toLocaleString()} <span className="text-xs font-semibold text-slate-500">แต้ม</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Fair Points Rules Card (Section 1.3 & 3.3 in prompt) */}
      <div className="p-5 rounded-2xl bg-white border border-[#FFC2D1]/70 shadow-sm space-y-3 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-[#FB6F92]" />
          <span>กติกาการให้แต้มแบบเน้นพัฒนาการ (Anti-Slop / Anti-Spam Gamification)</span>
        </div>
        <p className="text-slate-500 leading-relaxed">
          RISE ให้ความสำคัญกับความเข้าใจและการพัฒนาตนเอง ไม่ใช่การปั๊มจำนวนข้อสอบ จึงมีเกณฑ์คะแนนหลากหลายระดับ:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 space-y-0.5">
            <span className="font-bold text-[#9F1C42] block">+50-100 pts</span>
            <span className="text-[11px] text-slate-500">ทำ Mock Test จบชุด</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 space-y-0.5">
            <span className="font-bold text-[#9F1C42] block">+20 pts</span>
            <span className="text-[11px] text-slate-500">ภารกิจประจำวันครบ</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 space-y-0.5">
            <span className="font-bold text-[#9F1C42] block">+50 pts</span>
            <span className="text-[11px] text-slate-500">ทำสตรีคครบ 7 วัน</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 space-y-0.5">
            <span className="font-bold text-[#9F1C42] block">+15 pts</span>
            <span className="text-[11px] text-slate-500">ฝึกเรื่องที่เป็นจุดอ่อน</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 space-y-0.5">
            <span className="font-bold text-[#9F1C42] block">+40 pts</span>
            <span className="text-[11px] text-slate-500">คะแนนเพิ่มขึ้น 10%+</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/40 space-y-0.5">
            <span className="font-bold text-[#9F1C42] block">+25 pts</span>
            <span className="text-[11px] text-slate-500">ทบทวนคลังข้อผิดพลาด</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Zero-pill: functional buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FFE5EC]/50 rounded-xl border border-[#FFC2D1]/60 w-fit">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterCategory === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ของรางวัลทั้งหมด ({REWARDS_CATALOG.length})
        </button>
        <button
          onClick={() => setFilterCategory('physical')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterCategory === 'physical'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ของใช้จริง / Physical
        </button>
        <button
          onClick={() => setFilterCategory('digital')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterCategory === 'digital'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          คูปองดิจิทัล / Digital
        </button>
        <button
          onClick={() => setFilterCategory('history')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filterCategory === 'history'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ประวัติการแลก ({redeemedItems.length})
        </button>
      </div>

      {/* Content Area */}
      {filterCategory === 'history' ? (
        /* Redeemed History List */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">ประวัติการแลกของรางวัลของคุณ</h2>

          {redeemedItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#FFC2D1] p-6 space-y-2">
              <History className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">ยังไม่มีประวัติการแลกรางวัล</p>
              <p className="text-xs text-slate-500">
                เมื่อทำข้อสอบสะสมแต้มจนครบ สามารถเลือกแลกรางวัลด้านบนได้ทันที
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {redeemedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-[#FFC2D1]/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      <span className="text-[10px] font-bold text-[#FB6F92] bg-[#FFE5EC] px-2 py-0.5 rounded">
                        {item.category === 'physical' ? 'ของใช้ส่งถึงบ้าน' : 'E-Voucher'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>แลกเมื่อ {new Date(item.redeemedAt).toLocaleDateString('th-TH')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-semibold text-[#C23259]">
                        -{item.pointsCost} แต้ม
                      </span>
                    </div>

                    {item.shippingAddress && (
                      <p className="text-[11px] text-slate-600 pt-1">
                        📦 ที่อยู่จัดส่ง: {item.shippingAddress}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {item.code ? (
                      <div className="flex items-center gap-2 bg-[#FFF8F9] px-3 py-1.5 rounded-lg border border-[#FFC2D1]">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {item.code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(item.code!)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        {item.status === 'processing' ? 'กำลังเตรียมพัสดุ' : 'จัดส่งแล้ว'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Rewards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRewards.map((reward) => {
            const canAfford = userProfile.points >= reward.pointsCost;
            const pointsGap = reward.pointsCost - userProfile.points;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-2xl border border-[#FFC2D1]/60 shadow-sm hover:shadow-md hover:border-[#FB6F92]/40 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Reward Image with Fallback */}
                  <div className="relative aspect-square w-full bg-[#FFF5F7] overflow-hidden border-b border-[#FFC2D1]/40">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {reward.highlight && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#C23259] shadow-xs">
                        {reward.highlight}
                      </div>
                    )}
                  </div>

                  {/* Reward Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-[#C23259] tabular-nums">
                        {reward.pointsCost.toLocaleString()} <span className="text-xs font-semibold">แต้ม</span>
                      </span>
                      <span className="text-[11px] text-slate-400">คงเหลือ {reward.stock} ชิ้น</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                        {reward.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {reward.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-[#FFF8F9] border-t border-[#FFC2D1]/40">
                  {canAfford ? (
                    <button
                      onClick={() => handleStartRedeem(reward)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all text-center"
                    >
                      แลกรางวัลทันที
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <button
                        disabled
                        className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed text-center"
                      >
                        ขาดอีก {pointsGap.toLocaleString()} แต้ม
                      </button>
                      <button
                        onClick={() => onNavigateTab('exams')}
                        className="w-full text-center text-[11px] text-[#FB6F92] hover:text-[#C23259] font-medium"
                      >
                        ทำ Mock Test เพื่อสะสมแต้ม →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Physical Item Redemption Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#FFC2D1] space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#FB6F92] uppercase tracking-wider">
                  ยืนยันการแลกของรางวัล
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedReward.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReward(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1]/60 flex items-center justify-between text-xs">
              <span className="text-slate-600">แต้มที่จะถูกหัก:</span>
              <span className="text-base font-extrabold text-[#C23259] tabular-nums">
                -{selectedReward.pointsCost} แต้ม (คงเหลือ {userProfile.points - selectedReward.pointsCost})
              </span>
            </div>

            {selectedReward.category === 'physical' ? (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 block">กรอกข้อมูลการจัดส่งพัสดุ:</span>
                <div>
                  <label className="text-slate-600 block mb-1">ชื่อ-นามสกุลผู้รับ</label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">ที่อยู่จัดส่ง (บ้าน/หอพัก)</label>
                  <textarea
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 bg-white"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                สำหรับคูปองดิจิทัล รหัสโค้ดส่วนลดจะแสดงผลให้คุณคัดลอกทันทีหลังกดยืนยัน พร้อมนำไปใช้ที่หน้าร้านหรือออนไลน์ได้ทันที
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedReward(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8FAB] to-[#FB6F92] text-white text-xs font-bold hover:shadow-md hover:shadow-[#FB6F92]/25 active:scale-95 transition-all"
              >
                ยืนยันการแลกรางวัล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {redeemSuccessItem && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FFC2D1] text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">แลกรางวัลสำเร็จ!</h3>
              <p className="text-xs text-slate-600">
                คุณได้แลก <span className="font-semibold">{redeemSuccessItem.reward.title}</span> เรียบร้อยแล้ว
              </p>
            </div>

            {redeemSuccessItem.code ? (
              <div className="p-4 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1] space-y-2">
                <span className="text-[11px] text-slate-500 block">รหัสส่วนลดของคุณ:</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-extrabold text-[#C23259]">
                    {redeemSuccessItem.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(redeemSuccessItem.code!)}
                    className="p-1 text-slate-500 hover:text-slate-800"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedCode && (
                  <span className="text-[11px] text-emerald-600 font-semibold block animate-in fade-in">
                    คัดลอกรหัสเรียบร้อยแล้ว!
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#FFF8F9] border border-[#FFC2D1] text-xs text-slate-700 flex items-center justify-center gap-2">
                <Truck className="w-4 h-4 text-[#FB6F92]" />
                <span>ทีมงานจะจัดส่งพัสดุให้ภายใน 2-3 วันทำการ</span>
              </div>
            )}

            <button
              onClick={() => setRedeemSuccessItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              ตกลงและปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
