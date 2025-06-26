import { useEffect, useState } from "react";
import type { User } from "../../types/user";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AvatarGroup from "../AvatarGroup";
import { IoPersonCircleOutline } from "react-icons/io5";

interface SelectUsersProps {
  selectedUsers: User[];
  setSelectedUsers: (value: User[]) => void;
}

const SelectUsers = ({ selectedUsers, setSelectedUsers }: SelectUsersProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState<string[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(
      allUsers.filter((user) => tempSelectedUsers.includes(user._id))
    );
    setIsModalOpen(false);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.some((u) => u._id === user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    } else {
      setTempSelectedUsers(selectedUsers.map((user) => user._id));
    }
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button
          className="card-btn w-full h-[48px] flex justify-center items-center text-base"
          onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-lg" />
          Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3} />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users">
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b border-[#4C35A0]/20 hover:bg-gradient-to-r hover:from-blue-800/10 hover:to-purple-600/10 transition-all duration-200 rounded-lg">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-[#4C35A0]/30 shadow-lg shadow-blue-500/20"
                />
              ) : (
                <IoPersonCircleOutline className="w-10 h-10 text-white bg-[#2A1B5D] rounded-full border-2 border-[#4C35A0]/30 shadow-lg shadow-blue-500/20" />
              )}
              <div className="flex-1">
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-[13px] text-gray-300">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 text-primary-600 bg-[#2A1B5D] border-[#4C35A0] rounded-sm outline-none focus:ring-2 focus:ring-blue-400/50 accent-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[#4C35A0]/20 mt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
