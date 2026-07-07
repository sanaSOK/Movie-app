export const getAvatarUrl = (avatarPath, username) => {
  if (!avatarPath) {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username || 'default')}`;
  }
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }
  // Relative upload path, append backend port base url
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBase.replace('/api', '');
  return `${baseUrl}${avatarPath}`;
};
