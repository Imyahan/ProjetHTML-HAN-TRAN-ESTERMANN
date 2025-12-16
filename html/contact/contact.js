function submitContact() {
    const form = document.forms.quiz;

    const name = form.name.value;
    const email = form.email.value;
    const message = form.message.value;

    if (name && email && message) {
        alert("Merci pour votre message, " + name + " ! Nous vous répondrons bientôt à l'adresse " + email + ".");
        form.reset();
    } else {
        alert("Veuillez remplir tous les champs avant de soumettre le formulaire.");
    }

    if (name === "777") {
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
}
