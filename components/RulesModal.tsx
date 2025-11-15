
import React from 'react';
import { PIECE_EMOJI } from '../constants';
import { Player, PieceType } from '../types';

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
            <p>Mục tiêu của trò chơi là tiêu diệt tất cả quân cờ của đối phương. Người chơi nào làm được điều đó trước sẽ thắng.</p>
          </div>

           <div>
            <h3 className="text-xl font-semibold mb-2 text-amber-200">Địa hình đặc biệt</h3>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li><strong>Bàn cờ 6x6:</strong> Ván cờ diễn ra trên bàn cờ này.</li>
              <li><strong>Ô Đá (🪨):</strong> Các ô này là chướng ngại vật và không thể di chuyển vào.</li>
              <li><strong>Ô Tiến Hóa (✨):</strong> Khi một quân cờ di chuyển vào ô này, nó sẽ được <strong>tiến hóa</strong> vĩnh viễn, biến thành 'Đại tướng' (🚩). Một quân cờ đã tiến hóa sẽ có khả năng di chuyển 1 hoặc 2 ô theo mọi hướng (có thể nhảy qua quân khác), <strong>thay thế</strong> cho cách di chuyển và kỹ năng ban đầu của nó.</li>
            </ul>
          </div>


          <div>
            <h3 className="text-xl font-semibold mb-2 text-amber-200">Các quân cờ và Kỹ năng (chưa tiến hóa)</h3>
            <ul className="space-y-3">
              <li>
                <div className='font-bold'>Kiếm sĩ ({pieces.hero})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào (tới ô trống).</li>
                    <li><strong>Kỹ năng (Đâm kiếm):</strong> Nếu không di chuyển, Kiếm sĩ có thể tấn công và tiêu diệt một quân địch ở ô liền kề.</li>
                </ul>
              </li>
               <li>
                <div className='font-bold'>Kỵ sĩ ({pieces.horseman})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Chính xác hai ô theo bất kỳ hướng nào. Kỵ sĩ có thể nhảy qua đầu các quân cờ khác.</li>
                </ul>
              </li>
              <li>
                <div className='font-bold'>Cung thủ ({pieces.archer})</div>
                <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào (tới ô trống).</li>
                    <li><strong>Kỹ năng (Bắn tên):</strong> Nếu không di chuyển, Cung thủ có thể bắn một quân địch ở khoảng cách chính xác hai ô.</li>
                </ul>
              </li>
              <li>
                <div className='font-bold'>Lính búa ({pieces.axeman})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào.</li>
                    <li><strong>Kỹ năng (Vung búa):</strong> Nếu không di chuyển và có địch liền kề, Lính búa có thể tấn công tất cả quân địch trong vùng 3x3 ô xung quanh nó.</li>
                </ul>
              </li>
              <li>
                <div className='font-bold'>Lính cảm tử ({pieces.bomber})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào.</li>
                    <li><strong>Kỹ năng (Cảm tử):</strong> Khi bị một quân địch <strong>di chuyển vào ô để tiêu diệt</strong>, Lính cảm tử sẽ phát nổ và loại bỏ cả quân địch đó. Không kích hoạt bởi kỹ năng tầm xa.</li>
                </ul>
              </li>
               <li>
                <div className='font-bold'>Khiên thủ ({pieces.shieldbearer})</div>
                 <ul className='list-disc list-inside ml-4'>
                    <li><strong>Di chuyển:</strong> Một ô theo bất kỳ hướng nào.</li>
                    <li><strong>Kỹ năng (Thủ thế):</strong> Nếu không di chuyển, Khiên thủ có thể kích hoạt kỹ năng để vào thế thủ. Khi ở thế thủ, nó không thể bị tiêu diệt bởi kỹ năng của đối phương (bắn tên, đâm kiếm, vung búa). Di chuyển sẽ hủy bỏ thế thủ. Kỹ năng này tốn một lượt đi.</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-1 text-amber-200">Kết thúc ván cờ</h3>
             <ul className="list-disc list-inside ml-4">
               <li>Ván cờ kết thúc khi một bên không còn quân cờ nào. Bên còn lại sẽ là người chiến thắng.</li>
               <li>Nếu có giới hạn nước đi, ván cờ sẽ kết thúc <strong>hòa</strong> nếu không có ai thắng trước khi hết lượt.</li>
             </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-amber-200">Sự khắc chế lẫn nhau</h3>
            <p className="mb-2">Dưới đây là tóm tắt đơn giản về sự khắc chế lẫn nhau giữa các quân cờ:</p>
            <p className="mb-2">Về cơ bản, sự khắc chế trong Cờ Chiến Trận hoạt động giống như trò "Kéo, Búa, Bao", nhưng phức tạp hơn một chút:</p>
            <ul className="space-y-3 mb-2">
              <li>
                <div className='font-bold'>Tầm xa khắc chế Tầm gần:</div>
                <p className="ml-4">Cung thủ có lợi thế lớn khi đối đầu với các quân đi chậm và đánh gần như Kiếm sĩ và Lính búa vì có thể tấn công từ khoảng cách an toàn.</p>
              </li>
              <li>
                <div className='font-bold'>Cơ động khắc chế Tầm xa:</div>
                <p className="ml-4">Kỵ sĩ là khắc tinh của Cung thủ. Với khả năng di chuyển 2 ô và nhảy qua đầu, nó có thể nhanh chóng áp sát và tiêu diệt Cung thủ trước khi Cung thủ kịp hành động.</p>
              </li>
              <li>
                <div className='font-bold'>Phòng thủ khắc chế Kỹ năng:</div>
                <p className="ml-4">Khiên thủ khi đang ở thế thủ sẽ vô hiệu hóa hoàn toàn các kỹ năng tấn công của Cung thủ, Kiếm sĩ, và Lính búa. Đây là bức tường vững chắc để chống lại các đòn tấn công đặc biệt.</p>
              </li>
              <li>
                <div className='font-bold'>Hy sinh khắc chế Kẻ tấn công:</div>
                <p className="ml-4">Lính cảm tử là một cái bẫy. Bất kỳ quân nào (như Kỵ sĩ hay Đại tướng) di chuyển vào để ăn nó sẽ bị nổ banh xác cùng. Điều này buộc đối thủ phải dùng kỹ năng từ xa để xử lý nó một cách an toàn, làm lãng phí một lượt đi.</p>
              </li>
              <li>
                <div className='font-bold'>Sát thương lan khắc chế Co cụm:</div>
                <p className="ml-4">Lính búa cực kỳ mạnh khi đối phương dàn quân đứng gần nhau. Kỹ năng vung búa của nó có thể quét sạch nhiều quân cờ trong một lượt, trừng phạt lối chơi co cụm.</p>
              </li>
            </ul>
            <p><strong>Kiếm sĩ</strong> là quân cờ linh hoạt, không quá mạnh về mặt nào nhưng có thể đối phó tốt trong nhiều tình huống tầm gần, đặc biệt là khi áp sát được Cung thủ thì cứ thế ép Cung thủ vào tường và tiêu diệt.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RulesModal;
