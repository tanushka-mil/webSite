class Animate {
    constructor() {
        this.gradientInterval;
        this.params = {
            load: {
                selector: "mainMask",
                beginStep: -2000,
                finishStep: 1000,
                step: 50
            },
            main: {
                selector: "mainMask",
                beginStep: -2900,
                finishStep: 1000,
                step: 50,
                time: 2500
            },
            mobile: {
                selector: "mainMobileMask",
                beginStep: -700,
                finishStep: 400,
                step: 25,
                time: 3000
            }
        };
    }


    animateTransform(selector, beginStep, finishStep, step, axis = 'X') {
        const element = document.getElementById(selector);
        const transform = () => {
            const translateAxis = axis === 'X' ? beginStep : '0, ' + beginStep;
            beginStep += step;
            element.setAttribute('transform', 'translate('+ translateAxis +')');

            beginStep === finishStep ? cancelAnimationFrame(transform) : requestAnimationFrame(transform);
        };

        requestAnimationFrame(transform);
    }

    startAnimation() {
        this.animateTransform("first-fill", 100, -5, -5, `Y`);
        this.animateTransform("second-fill", -200, 10, 10, `Y`);
        this.animateTransform("third-fill", -100, 5, 5, `Y`);
        this.animateTransform("fourth-fill", 200, -10, -10, `Y`);
    }

    initGradient(params) {
        this.animateTransform(this.params[params].selector, this.params[params].beginStep, this.params[params].finishStep, this.params[params].step);
    }

    initGradientInterval(params) {
        this.gradientInterval = setInterval(() => {
            this.initGradient(params);
        }, this.params[params].time);
    }

    clearGradientInterval() {
        clearInterval(this.gradientInterval);
    }
}


class Validate {
    constructor() {
        this.emailParams = {};
    }

    checkValidField(fieldElement) {
        this.pattern = new RegExp(fieldElement.pattern);
        this.result = fieldElement.id === 'email-field' ? this.pattern.exec(fieldElement.value.toLowerCase()) : this.pattern.exec(fieldElement.value);
        this.checkEmptyField(fieldElement);

        if (!this.result || fieldElement.id === 'message-field' && fieldElement.value.length < 50) {
            this.setErrorClass(fieldElement);
        } else {
            this.clearErrors(fieldElement);
            this.emailParams[fieldElement.name] = fieldElement.value;
        }
    }

    setErrorClass(fieldElement) {
        fieldElement.parentElement.classList.add('error');
        fieldElement.validFieldCount = false;
    }

    clearErrors(fieldElement) {
        fieldElement.parentElement.classList.remove('error');
        fieldElement.validFieldCount = true;
    }

    checkEmptyField(fieldElement) {
        this.blockClassList = fieldElement.parentElement.classList;
        fieldElement.value ? this.blockClassList.add('not-empty') : this.blockClassList.remove('not-empty');
    }

    sendForm() {
        const fields = $('#form .field');
        this.validFieldsCount = 0;

        fields.each((index, field) => {
            this.checkValidField(field);
            field.value !== '' && field.validFieldCount ? this.validFieldsCount += 1 : this.validFieldsCount -= 1;
        });

        if (this.validFieldsCount === fields.length) {
            sendForm.send(this.emailParams);
        }
    }
}


class Plugin {
    constructor() {
        this.statePluginWorking;
    }

    init() {
        this.statePluginWorking = true;

        $('#fullpage').fullpage({
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: ['Home', 'About', 'Contact Us'],
            showActiveTooltip: true,
            scrollingSpeed: 1000,
            easingcss3: 'none',
            fadingEffect: false,
            afterRender: () => {
                animate.startAnimation();
                animate.initGradientInterval('main');
            }
        });
    }

    destroy() {
        this.statePluginWorking = false;
        $.fn.fullpage.destroy('all');
    }
}


class WindowResize {
    constructor() {
        this.resizePoint = 767;
    }

    init() {
        $(".loader").remove();
        $('body').removeClass('loading');

        if (document.documentElement.clientWidth > this.resizePoint && !plugin.statePluginWorking) {
            this.desktopView();
        } else if (document.documentElement.clientWidth <= this.resizePoint) {
            animate.clearGradientInterval();
            animate.initGradientInterval('mobile');

            if (plugin.statePluginWorking) {
                this.mobileView();
            }
        }
    }

    desktopView() {
        animate.clearGradientInterval();
        $('.anchor').removeAttr("name");
        plugin.init();
    }

    mobileView() {
        plugin.destroy();
        $('#section2 .anchor').attr("name","AboutUs");
        $('#section3 .anchor').attr("name","ContactUS");
    }
}


class SendForm {
    send(emailMassage) {
        const message = `Name: ${emailMassage.name} \nEmail: ${emailMassage.email} \nPhone Number: ${emailMassage.phone} \nMessage: ${emailMassage.message}`;
        const settings = {
            "to": "insurancerevenuetest@gmail.com",
            "url": "https://api:key-af9370a96ee53df27a764555aacb37f4@api.mailgun.net/v3/sandboxb17b077be1ce4b0caf2433578761d938.mailgun.org/messages",
            "method": "POST",
            "subject": "Contact Us Message",
            "text": message,
            "from": "From Ivan <Ivan@sandboxb17b077be1ce4b0caf2433578761d938.mailgun.org>"
        };

        this.success();

        console.log(settings, 'params for send');

        $.ajax(settings).done((response) => {
            console.log(response, 'response after send');
        });
    }

    success() {
        $('#form').addClass('invisible');
        $('.success-message').addClass('active');
    }
}


class Menu {
    checkSate() {
        $('.open-menu').length ? $('.menu-wrap').removeClass('open-menu') :  $('.menu-wrap').addClass('open-menu');
    }
}


const animate = new Animate();
const validate = new Validate();
const plugin = new  Plugin();
const windowResize = new WindowResize();
const menu = new Menu();
const sendForm = new SendForm();


$(document).ready(() => {

    setTimeout(() => {
        animate.startAnimation();
        animate.initGradient('load');
    }, 300);

    setTimeout(() => {
        windowResize.init();
    }, 2000);

    // $("#phone-field").mask("000 000 00 00");

    $("#phone-field").mask(
        '### ###', {
            translation: {
                '#': {
                    pattern: /a-zA-Z/, recursive: true

                    // pattern: /\^([A-Za-z]+\s?[A-Za-z])+$/, recursive: true
                    // /^(?! )([A-Za-z\s])+$/
                },
                // 'A': {
                //     pattern: /^[\s]+$/, recursive: false
                // }
            }
        }
    );

    const form = document.getElementById('form');

    form.addEventListener("focus", (event) => {
        validate.clearErrors(event.target);
    }, true);

    form.addEventListener("blur", (event) => {
        validate.checkEmptyField(event.target);
    }, true);

    $('.menu-wrap').click(() => {menu.checkSate()});

    $('#send-button').click((e) => {
        e.preventDefault();
        validate.sendForm();
    });

});

$(window).resize(() => windowResize.init());
