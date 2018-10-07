export default function toast(message: string) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.className = 'show';
  setTimeout(() => {
    toast.className = '';
  }, 3000);
}
