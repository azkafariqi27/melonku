export const handleRipple = (event) => {
  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;

  // Tentukan apakah tombol primary (gelap) atau secondary (terang) untuk menyesuaikan warna riak
  const isPrimary =
    button.classList.contains("bg-primary") ||
    button.classList.contains("bg-primary-dark") ||
    button.classList.contains("bg-melon-gradient");
  circle.classList.add(isPrimary ? "ripple-light" : "ripple-dark");
  circle.classList.add("ripple-effect");

  const existingRipple = button.getElementsByClassName("ripple-effect")[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);

  setTimeout(() => {
    circle.remove();
  }, 600);
};
