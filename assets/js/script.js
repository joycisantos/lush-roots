window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    const content = document.getElementById("content");

    // Oculta o preloader quando a página estiver totalmente carregada
    preloader.classList.add("hidden");

    // Exibe o conteúdo principal
    content.style.display = "block";
});


document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        AOS.init();
    }, 100);


    // Função para inicializar o contador regressivo
    (function () {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        // Configuração da data do evento
        let today = new Date(),
            dd = String(today.getDate()).padStart(2, "0"),
            mm = String(today.getMonth() + 1).padStart(2, "0"),
            yyyy = today.getFullYear(),
            nextYear = yyyy + 1,
            dayMonth = "12/10/",
            bigDay = dayMonth + yyyy;

        today = mm + "/" + dd + "/" + yyyy;
        if (today > bigDay) {
            bigDay = dayMonth + nextYear;
        }

        // Inicialização do contador regressivo
        const countDown = new Date(bigDay).getTime();
        const x = setInterval(function () {
            const now = new Date().getTime(),
                distance = countDown - now;

            // Atualização dos valores no DOM
            document.getElementById("days").innerText = Math.floor(distance / (day)),
                document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
                document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
                document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
        }, 1000); // Atualiza a cada segundo
    }());

    // Inicialização da galeria de imagens
    lightGallery(document.getElementById('lightgallery'), {
        selector: 'a', // Define que os links <a> são os itens da galeria
        mode: 'lg-fade', // Modo de transição
        thumbnail: true, // Habilita miniaturas
        download: false, // Desabilita botão de download
    });

    // Configuração do Swiper para depoimentos
    const swiperTestmonials = new Swiper('.swiper-testmonials', {
        loop: false,
        slidesPerView: 2,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-button-testmonials-next',
            prevEl: '.swiper-button-testmonials-prev',
        },
        pagination: {
            el: '.swiper-pagination-testmonials',
            clickable: true,
        },
        breakpoints: {
            500: {
                slidesPerView: 1,
            },
            780: {
                slidesPerView: 2,
            },
            1300: {
                slidesPerView: 2,
            },
            1630: {
                slidesPerView: 2,
            }
        }
    });

    // Função para sincronizar sliders principais com miniaturas
    const multipleSwiperSlides = function () {
        const sliderMain = document.querySelectorAll('.swiper-container.js-slider--main');
        const sliderNav = document.querySelectorAll('.swiper-container.js-slider--nav');

        const mainArray = [];
        const navArray = [];

        // Slider Principal
        sliderMain.forEach(function (element) {
            mainArray.push(
                new Swiper(element, {
                    loop: true,
                    loopedSlides: 3,
                    navigation: {
                        nextEl: element.querySelector('.swiper-button-next'),
                        prevEl: element.querySelector('.swiper-button-prev'),
                    },
                })
            );
        });

        // Slider Miniaturas
        sliderNav.forEach(function (element) {
            navArray.push(
                new Swiper(element, {
                    slidesPerView: 3,
                    loop: true,
                    loopedSlides: 3,
                    slideToClickedSlide: true,
                    spaceBetween: 20,
                })
            );
        });

        // Sincronização entre os sliders
        if (sliderMain.length > 0 && sliderNav.length > 0) {
            for (let i = 0; i < mainArray.length; i++) {
                mainArray[i].controller.control = navArray[i];
                navArray[i].controller.control = mainArray[i];
            }
        }
    };
    multipleSwiperSlides(); // Chama a função para sincronizar os sliders

    // Validação e envio do formulário
    document.getElementById('contact-form-submit').addEventListener('submit', function (e) {
        e.preventDefault(); // Previne o envio real do formulário

        let isValid = true; // Flag para validar o formulário

        // Remove mensagens de erro anteriores
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // Remove classes de erro anteriores
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));

        // Lista dos campos obrigatórios
        const requiredFields = ['name', 'email', 'phone', 'agree'];

        requiredFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            let errorMessage = '';

            // Valida o checkbox
            if (fieldId === 'agree') {
                const checkboxContainer = input.closest('.agree div');
                if (!input.checked) {
                    isValid = false;
                    errorMessage = '';
                    checkboxContainer.classList.add('error');
                } else {
                    checkboxContainer.classList.remove('error');
                }
            }
            // Valida outros campos
            else if (!input.value.trim()) {
                isValid = false;
                errorMessage = `${input.placeholder} is required.`;
            } else if (fieldId === 'email') {
                // Validação de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }

            // Exibe a mensagem de erro
            if (errorMessage) {
                if (fieldId === 'agree') {
                    const errorElement = document.createElement('p');
                    errorElement.className = 'error-message';
                    errorElement.style.color = 'red';
                    errorElement.style.fontSize = '12px';
                    errorElement.textContent = errorMessage;
                    input.closest('.agree').appendChild(errorElement);
                } else {
                    input.style.border = '2px solid red';
                    const errorElement = document.createElement('p');
                    errorElement.className = 'error-message';
                    errorElement.style.color = 'red';
                    errorElement.style.fontSize = '12px';
                    errorElement.textContent = errorMessage;
                    input.insertAdjacentElement('afterend', errorElement);
                }
            } else {
                if (fieldId !== 'agree') input.style.border = '';
            }
        });

        // Se o formulário for válido, prossegue com a execução
        if (isValid) {
            const name = document.getElementById('name').value;
            localStorage.setItem('userName', name); // Armazena o nome no localStorage
            location.reload(); // Recarrega a página
        }
    });

    // Após o carregamento da página
    window.addEventListener('load', function () {
        const name = localStorage.getItem('userName');
        if (name) {
            const output = document.getElementById('output');
            output.textContent = 'Welcome, ' + name + '!';
            output.style.display = 'block';

            // Esconde o formulário e exibe o conteúdo
            document.getElementById('contact-form').classList.add('hidden');
            document.getElementById('site-content').classList.add('visible');

            // Rola a página para o topo
            window.scrollTo(0, 0);

            // Atualiza os sliders
            if (typeof Swiper !== 'undefined') {
                document.querySelectorAll('.swiper-container').forEach(container => {
                    container.swiper.update();
                });
                document.querySelectorAll('.swiper-testmonials').forEach(container => {
                    container.swiper.update();
                });
            }
        }
    });

    // Máscara de telefone no padrão brasileiro
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function () {
        let phoneValue = phoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        // Limita o número de caracteres a 11 (incluindo o DDD e 9 dígitos)
        if (phoneValue.length > 11) {
            phoneValue = phoneValue.slice(0, 11);
        }

        // Aplica a máscara no formato brasileiro
        if (phoneValue.length <= 2) {
            phoneValue = `(${phoneValue}`;
        } else if (phoneValue.length <= 6) {
            phoneValue = `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2)}`;
        } else if (phoneValue.length <= 10) {
            phoneValue = `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2, 6)}-${phoneValue.slice(6)}`;
        } else {
            phoneValue = `(${phoneValue.slice(0, 2)}) ${phoneValue.slice(2, 7)}-${phoneValue.slice(7)}`;
        }

        phoneInput.value = phoneValue;
    });
});
