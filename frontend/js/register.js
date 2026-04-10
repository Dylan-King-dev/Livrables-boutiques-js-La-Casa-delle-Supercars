const guestBtn = document.getElementById("guestContinue");
if (guestBtn) {
  guestBtn.addEventListener("click", () => {
    if (document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.history.back();
    }
  });
}
