
import React from 'react';
import { PIECE_EMOJI } from '../constants';
import { Player } from '../types';

interface RulesModalProps {
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  const pieces = PIECE_EMOJI[Player.White];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 text-gray-200 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold text-gray-400 hover:text-white"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4 text-amber-300">Luật chơi Cờ Chiến Trận</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-1 text-amber-200">Mục tiêu</h3>
            <p>Mục tiêu của trò chơi là <strong>tiêu diệt tất cả quân cờ</strong> của đối phương. Người chơi nào làm được điều đó trước sẽ thắng.</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-amber-200">Các quân cờ và Kỹ năng</h3>
            <ul className="space-y-3">
              <li>
                <div className='font-bold'>Kiếm sĩ ({pieces.hero})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào (tới ô trống).</li>
                    <li><strong>Kỹ năng (Đâm kiếm):</strong> Nếu không di chuyển, Kiếm sĩ có thể tấn công và tiêu diệt một quân địch ở ô liền kề. Lượt đi sẽ kết thúc sau khi tấn công.</li>
                </ul>
              </li>
              <li><strong>Kỵ sĩ ({pieces.horseman}):</strong> Di chuyển chính xác hai ô theo bất kỳ hướng nào (ngang, dọc, hoặc chéo). Kỵ sĩ có thể nhảy qua đầu các quân cờ khác.</li>
              <li>
                <div className='font-bold'>Cung thủ ({pieces.archer})</div>
                <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào.</li>
                    <li><strong>Kỹ năng (Bắn tên):</strong> Nếu không di chuyển, Cung thủ có thể bắn một quân địch ở khoảng cách chính xác hai ô. Lượt đi sẽ kết thúc sau khi bắn.</li>
                </ul>
              </li>
              <li>
                <div className='font-bold'>Lính búa ({pieces.axeman})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào.</li>
                    <li><strong>Kỹ năng (Vung búa):</strong> Nếu không di chuyển, Lính búa có thể tấn công tất cả quân địch trong vùng 3x3 xung quanh nó. Để kích hoạt, hãy nhấp vào Lính búa một lần nữa sau khi đã chọn.</li>
                </ul>
              </li>
              <li>
                <div className='font-bold'>Lính cảm tử ({pieces.bomber})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào.</li>
                    <li><strong>Kỹ năng (Cảm tử):</strong> Khi bị một quân địch <strong>di chuyển vào ô để tiêu diệt</strong>, Lính cảm tử sẽ phát nổ và loại bỏ cả quân địch đó. Kỹ năng này không kích hoạt nếu Lính cảm tử bị tiêu diệt bởi kỹ năng tầm xa (Cung thủ) hoặc kỹ năng đặc biệt khác (Kiếm sĩ, Lính búa).</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-1 text-amber-200">Kết thúc ván cờ</h3>
             <ul className="list-disc list-inside ml-4">
               <li>Ván cờ kết thúc khi một bên không còn quân cờ nào trên bàn cờ. Bên còn lại sẽ là người chiến thắng.</li>
               <li>Nếu trò chơi có giới hạn số nước đi, ván cờ sẽ kết thúc với kết quả <strong>hòa</strong> nếu không có ai thắng trước khi hết lượt.</li>
             </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RulesModal;
