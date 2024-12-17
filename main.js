document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openFormBtn = document.getElementById("openFormBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const responseMessage = document.getElementById("responseMessage");


    // LocalStorage data restoration
    const restoreFormData = () => {
        const savedData = JSON.parse(localStorage.getItem("formData")) || {};
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = savedData[key];
        });
    };

    const saveFormData = () => {
        const formData = {};
        new FormData(feedbackForm).forEach((value, key) => {
            formData[key] = value;
        });
        localStorage.setItem("formData", JSON.stringify(formData));
    };

    const clearFormData = () => {
        localStorage.removeItem("formData");
        feedbackForm.reset();
    };

    const showPopup = () => {
        popup.style.display = "flex";
        history.pushState({ popupOpen: true }, "", "#feedback-form");
    };

    const closePopup = () => {
        popup.style.display = "none";
        history.replaceState({ popupOpen: false }, "", "");
    };

    // Open/Close popup
    openFormBtn.addEventListener("click", showPopup);
    closeFormBtn.addEventListener("click", closePopup);

    // History handling
    window.addEventListener("popstate", (event) => {
        if (event.state?.popupOpen) {
            showPopup();
        } else {
            closePopup();
        }
    });

    // Submit form
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveFormData();

        // **ВАЖНО**: Получаем значения элементов формы *здесь*
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const organization = document.getElementById("organization").value;
        const message = document.getElementById("message").value;


        // Проверка на пустые поля (можно добавить больше валидаций)
        if (!name || !email || !phone || !message || !organization) {
            responseMessage.textContent = "Заполните все поля!";
            responseMessage.style.color = "red";
            return; // Прерываем отправку
        }


        try {
          const response = await fetch(
              `https://api.telegram.org/bot6225547753:AAFVEl4lSZ4G0cN-zmZAL1O3LTu4dBDf7ug/sendMessage`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    chat_id: 5106244821, // Замените на ID чата админа
                    text: `Новая заявка:\nИмя: ${name} \nemail: ${email}\nТелефон: ${phone}\nСообщение: ${message} \nОрганизация: ${organization}`,
                  }),
                }
              );

            if (response.ok) {
                closePopup();
                clearFormData();
                alert("Форма успешно отправлена!");
            }else{
              throw new Error("Ошибка отправки сообщения в Telegram");
            }

        } catch (error) {
            responseMessage.textContent = error.message;
            responseMessage.style.color = "red";
        }
    });

    // Restore form data (после объявления обработчика submit)
     restoreFormData();
});