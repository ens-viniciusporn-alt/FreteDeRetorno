/* =========================================================
   AUTENTICAÇÃO - PROTÓTIPO
========================================================= */


/* =========================================================
   MOSTRAR / OCULTAR SENHA
========================================================= */

const passwordToggle = document.getElementById("passwordToggle");
const passwordInput = document.getElementById("password");

if (passwordToggle && passwordInput) {

    passwordToggle.addEventListener("click", () => {

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        passwordToggle.textContent =
            isPassword ? "Ocultar" : "Mostrar";

        passwordToggle.setAttribute(
            "aria-label",
            isPassword
                ? "Ocultar senha"
                : "Mostrar senha"
        );

    });

}


/* =========================================================
   LOGIN
========================================================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            clearErrors();

            const email =
                document.getElementById("email");

            const password =
                document.getElementById("password");

            const message =
                document.getElementById("loginMessage");

            let isValid = true;


            /* E-mail */

            if (!email.value.trim()) {

                showError(
                    "emailError",
                    "Informe seu e-mail."
                );

                isValid = false;

            }
            else if (!isValidEmail(email.value)) {

                showError(
                    "emailError",
                    "Informe um e-mail válido."
                );

                isValid = false;

            }


            /* Senha */

            if (!password.value.trim()) {

                showError(
                    "passwordError",
                    "Informe sua senha."
                );

                isValid = false;

            }


            if (!isValid) {

                showMessage(
                    message,
                    "Verifique os dados informados.",
                    "error"
                );

                return;

            }


            /*
             * IMPORTANTE:
             *
             * Ainda não existe autenticação real.
             *
             * Esta mensagem serve somente para o protótipo.
             */

            showMessage(
                message,
                "Login validado no protótipo. A autenticação real será conectada posteriormente.",
                "success"
            );

        }
    );

}


/* =========================================================
   CADASTRO
========================================================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            clearErrors();

            const profile =
                document.querySelector(
                    'input[name="profile"]:checked'
                );

            const name =
                document.getElementById("name");

            const email =
                document.getElementById("registerEmail");

            const password =
                document.getElementById("registerPassword");

            const confirmPassword =
                document.getElementById("confirmPassword");

            const terms =
                document.getElementById("terms");

            const message =
                document.getElementById(
                    "registerMessage"
                );

            let isValid = true;


            /* Perfil */

            if (!profile) {

                showError(
                    "profileError",
                    "Selecione o tipo de conta."
                );

                isValid = false;

            }


            /* Nome */

            if (name.value.trim().length < 3) {

                showError(
                    "nameError",
                    "Informe seu nome."
                );

                isValid = false;

            }


            /* E-mail */

            if (!email.value.trim()) {

                showError(
                    "registerEmailError",
                    "Informe seu e-mail."
                );

                isValid = false;

            }
            else if (!isValidEmail(email.value)) {

                showError(
                    "registerEmailError",
                    "Informe um e-mail válido."
                );

                isValid = false;

            }


            /* Senha */

            if (password.value.length < 6) {

                showError(
                    "registerPasswordError",
                    "A senha deve possuir pelo menos 6 caracteres."
                );

                isValid = false;

            }


            /* Confirmação */

            if (
                confirmPassword.value !==
                password.value
            ) {

                showError(
                    "confirmPasswordError",
                    "As senhas não coincidem."
                );

                isValid = false;

            }


            /* Termos */

            if (!terms.checked) {

                showMessage(
                    message,
                    "É necessário concordar com os termos de uso.",
                    "error"
                );

                isValid = false;

            }


            if (!isValid) {

                if (!message.classList.contains("show")) {

                    showMessage(
                        message,
                        "Verifique os dados informados.",
                        "error"
                    );

                }

                return;

            }


            /*
             * Por enquanto apenas simulamos
             * o cadastro.
             */

            const selectedProfile =
                profile.value;


            let profileName;

            if (
                selectedProfile ===
                "cliente"
            ) {

                profileName = "Cliente";

            }
            else {

                profileName = "Transportador";

            }


            showMessage(
                message,
                `Cadastro de ${profileName} validado no protótipo. A integração com o servidor será feita posteriormente.`,
                "success"
            );

        }
    );

}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


function showError(
    elementId,
    message
) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;

}


function showMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove(
        "show",
        "error",
        "success"
    );

    element.classList.add(
        "show",
        type
    );

}


function clearErrors() {

    const errors =
        document.querySelectorAll(
            ".form-error"
        );

    errors.forEach((error) => {

        error.textContent = "";

    });


    const messages =
        document.querySelectorAll(
            ".form-message"
        );

    messages.forEach((message) => {

        message.textContent = "";

        message.classList.remove(
            "show",
            "error",
            "success"
        );

    });

}