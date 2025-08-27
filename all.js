const { createApp } = Vue;

const API_BASE_URL = 'https://creators.llc/api';
const ANALYTICS_ID = 'UA-90265209-1';
const GTM_ID = 'GTM-58WRXZQ';

const socialMediaUrls = {
    instagram: 'https://www.instagram.com/',
    youtube: 'https://www.youtube.com/',
    tiktok: 'https://www.tiktok.com/',
    twitch: 'https://www.twitch.tv/'
};

const PASSWORD_REQUIREMENTS = {
    MIN_LENGTH: 8,
    PATTERNS: {
        LOWERCASE: /[a-z]/,
        UPPERCASE: /[A-Z]/,
        NUMBER: /\d/,
        SPECIAL: /[!@#$%^&*(),.?":{}|<>]/
    }
};

createApp({
    data() {
        return {
            error: '',
            success: '',
            isLoading: false,
            ui: {
                loading: true,
                showModal: false,
                isMenuOpen: false,
                scrolled: false,
                showAllFields: true,
                showingTooltip: false,
                isBlocked: true
            },
            activeIndex: null,

            form: {
                data: {
                    name: "",
                    email: "",
                    password: "",
                    phone: "",
                    perfil: "",
                    origin: "youtube_shorts_br",
                    date_subscription: "",
                    specialities: [],
                    validacaoRedes: [{ socialMedia: '', link: '' }],
                    new: true
                },
                validation: {
                    passwordStrength: '',
                    selectedCount: 0,
                    isLoading: false,
                    success: '',
                    error: ''
                }
            },

            verification: {
                inputCode: '',
                correctCode: '',
                errorMessage: ''
            },

            tutors: [
                {
                    image: "assets/tutor/loud.png",
                    name: "@loud_victor",
                    description: "Victor, conhecido como LOUD Coringa, é um dos maiores nomes do universo gamer no Brasil. Criador de conteúdo e streamer com forte presença em jogos como GTA RP e Free Fire, ele é cofundador da LOUD e referência em engajamento, autenticidade e impacto na cena gamer nacional."
                },
                {
                    image: "assets/tutor/paula.png",
                    name: "@paulanobrez",
                    description: "Paula Nobre é uma das streamers mais influentes do cenário gamer brasileiro. Integrante da FURIA Esports, destaca-se pelo carisma, autenticidade e por ser referência em representatividade feminina nos games."
                },
                {
                    image: "assets/tutor/play_hard.png",
                    name: "@brunoplayhard",
                    description: "Bruno PlayHard é criador de conteúdo e CEO da LOUD, uma das maiores orgs de esports do Brasil. Referência em jogos mobile e liderança no universo gamer, soma milhões de seguidores e forte influência no mercado."
                },
                {
                    image: "assets/tutor/daiki.png",
                    name: "@gianzetta",
                    description: "Gianluca Sorice Lanzetta, conhecido como Gianzetta ou 'sua waifu musculosa favorita', é criador de conteúdo que une o universo gamer, geek e fitness com humor e autenticidade. Apresentador, campeão de powerlifting e pai, ele compartilha seu dia a dia em plataformas como Instagram e TikTok, promovendo um estilo de vida saudável e divertido no cenário gamer."
                },
            ],
            accordionItems: [
                {
                    title: 'O programa é pago?',
                    content: 'Não! Totalmente gratuito para os selecionados.'
                },
                {
                    title: 'Como faço para me inscrever?',
                    content: 'Preencha o <u data-bs-toggle="modal" data-bs-target="#exampleModalToggle">Formulário de Seleção</u> e analisaremos sua inscrição.'
                },
                {
                    title: 'Sou iniciante, posso participar?',
                    content: 'Se você tem 5k+ seguidores e publica com frequência, sim! Não exigimos experiência prévia com gastronomia.'
                },
                {
                    title: 'Para ser selecionado/a, preciso postar só sobre comida?',
                    content: 'Não. O foco é gastronomia local, mas você pode abordar rolês, experiências, storytelling — queremos criatividade.'
                },
                {
                    title: 'Tenho que ir até os restaurantes?',
                    content: 'Sim! Vamos enviar uma lista curada com lugares em SP, além de vouchers para facilitar sua visita.'
                },
                {
                    title: 'Posso gravar com celular?',
                    content: 'Deve! As aulas vão te ensinar a extrair o melhor da câmera que você já tem no bolso.'
                },
                {
                    title: 'Quanto tempo dura o programa?',
                    content: 'O programa acontecerá durante 8 semanas, entre setembro de 2025 a novembro de 2025, com aulas ao vivo a cada quinze dias, das 19h às 20h. Os alunos terão atividades complementares e mentorias ao longo programa com horários a definir.'
                },

            ],
            activate: false,
            verticals: [
                { name: "Beleza", id: 263 },
                { name: "Casa", id: 306 },
                { name: "Decoração", id: 307 },
                { name: "Esporte", id: 305 },
                { name: "Fitness", id: 264 },
                { name: "Games", id: 362 },
                { name: "Moda", id: 323 },
                { name: "Tecnologia", id: 368 },
                { name: "Culinária & Gastronomia", id: 267 },
                { name: "Saúde & Bem Estar", id: 365 },
                { name: "Música & Cultura", id: 262 },
                { name: "Finanças", id: 331 },
                { name: "Empreendedorismo", id: 308 },
                { name: "Educação & Carreira", id: 311 },
                { name: "Dicas Locais", id: 375 }
            ]
        };
    },

    mounted() {
        this.initializeApp();
    },

    watch: {
        'form.data.specialities': {
            handler() {
                this.updateSelectedCount();
            },
            deep: true
        },

        'verification.inputCode': {
            handler(newVal) {
                this.verification.inputCode = newVal;
            }
        }
    },

    methods: {
        addSocialMedia() {
            if (this.formData.validacaoRedes.length < 2) {
                this.formData.validacaoRedes.push({ socialMedia: '', link: '' });
            }
        },
        formLogin() {
            this.error = "";
            this.success = "";
            this.isLoading = true;

            fetch('https://creators.llc/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(this.formData),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.isLoading = false;

                    if (data.error) {
                        this.error = data.error.message;
                    }
                    else if (data) {
                        const now = new Date();
                        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
                        this.formData.date_subscription = formattedDate;

                        this.handleLoginResponse(data);
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    this.error = error.message || 'Erro de conexão. Tente novamente.';
                });
        },
        initializeApp() {
            this.loadAnalytics();
            this.setupEventListeners();
            this.initializeAnimations();
        },
        loadAnalytics() {
            this.loadGoogleAnalytics();
            this.loadGoogleTagManager();
        },
        setupEventListeners() {
            document.addEventListener('click', this.handleClickOutside);
            window.addEventListener('scroll', this.handleScroll);
        },
        initializeAnimations() {
            if (typeof AOS !== 'undefined') {
                AOS.init();
            }
        },
        toggleMenu() {
            this.ui.isMenuOpen = !this.ui.isMenuOpen;

            if (this.ui.isMenuOpen) {
                this.scheduleMenuClose();
            }
        },
        scheduleMenuClose() {
            setTimeout(() => {
                const collapseElement = document.getElementById('navbarMenu');
                if (collapseElement?.classList.contains('show')) {
                    setTimeout(() => {
                        this.ui.isMenuOpen = false;
                    }, 300);
                }
            }, 100);
        },
        handleClickOutside(event) {
            const navbar = document.querySelector('.navbar-collapse');
            const toggler = document.querySelector('.navbar-toggler');

            if (this.isClickOutsideNavbar(event, navbar, toggler)) {
                this.closeMenuIfOpen(navbar);
            }
        },
        isClickOutsideNavbar(event, navbar, toggler) {
            return navbar &&
                !navbar.contains(event.target) &&
                !toggler.contains(event.target);
        },
        closeMenuIfOpen(navbar) {
            if (navbar.classList.contains('show')) {
                this.ui.isMenuOpen = false;
            }
        },
        handleScroll() {
            this.ui.scrolled = window.scrollY > 50;
        },
        toggleAccordion(index) {
            this.activeIndex = this.activeIndex === index ? null : index;
        },
        formatPhone() {
            let phone = this.form.data.phone.replace(/\D/g, '');

            if (phone.length >= 2) {
                this.form.data.phone = `(${phone.substring(0, 2)}`;
            }

            if (phone.length > 2) {
                this.form.data.phone += `) ${phone.substring(2, 7)}`;
            }

            if (phone.length > 7) {
                this.form.data.phone += `-${phone.substring(7, 11)}`;
            }
        },
        formatTelefone() {
            this.formatPhone();
        },
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        isValidUrl(url) {
            try {
                const urlObj = new URL(url);
                return ['http:', 'https:'].includes(urlObj.protocol);
            } catch {
                return false;
            }
        },
        isValidPhone(phone) {
            const numbersOnly = phone.replace(/\D/g, '');
            return numbersOnly.length >= 10 && numbersOnly.length <= 15;
        },
        checkPasswordStrength() {
            const password = this.form.data.password;
            this.form.validation.passwordStrength = this.calculatePasswordStrength(password);
        },
        calculatePasswordStrength(password) {
            const { MIN_LENGTH, PATTERNS } = PASSWORD_REQUIREMENTS;

            if (password.length >= MIN_LENGTH &&
                PATTERNS.LOWERCASE.test(password) &&
                PATTERNS.UPPERCASE.test(password) &&
                PATTERNS.NUMBER.test(password)) {
                return 'Forte';
            } else if (password.length >= 6 &&
                /[a-zA-Z]/.test(password) &&
                PATTERNS.NUMBER.test(password)) {
                return 'Média';
            } else {
                return 'Fraca';
            }
        },

        validateSpecialities() {
            if (!Array.isArray(this.form.data.specialities)) {
                return false;
            }
            if (this.form.data.specialities.length === 0) {
                return false;
            }
            return true;
        },
        removeSocialMedia() {
            if (this.form.data.validacaoRedes.length > 1) {
                this.form.data.validacaoRedes.pop();
            }
        },
        getBaseLink(socialMedia) {
            return socialMediaUrls[socialMedia] || '';
        },

        // MÉTODO ANTIGO - Mantido para compatibilidade
        validateSocialMedia() {
            if (!Array.isArray(this.form.data.validacaoRedes) ||
                this.form.data.validacaoRedes.length === 0) {
                return true;
            }
            const firstItem = this.form.data.validacaoRedes[0];
            if (firstItem.socialMedia.trim() !== '' || firstItem.link.trim() !== '') {
                return firstItem.socialMedia.trim() !== '' && firstItem.link.trim() !== '';
            }

            return true;
        },
        activeButton() {
            this.activate = true
        },
        validateFormStrictly() {
            this.form.validation.errors = {};
            let isValid = true;
            const requiredFields = {
                'name': 'Nome',
                'email': 'E-mail',
                'password': 'Senha',
                'phone': 'Telefone'
            };
            Object.keys(requiredFields).forEach(field => {
                const value = this.form.data[field];

                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    this.form.validation.errors[field] = `${requiredFields[field]} é obrigatório`;
                    isValid = false;
                }
            });

            if (!Array.isArray(this.form.data.specialities) ||
                this.form.data.specialities.length === 0) {
                this.form.validation.errors.specialities = 'Selecione pelo menos uma especialidade';
                isValid = false;
            }

            if (!Array.isArray(this.form.data.validacaoRedes) ||
                this.form.data.validacaoRedes.length === 0) {
                this.form.validation.errors.socialMedia = 'Adicione pelo menos uma rede social';
                isValid = false;
            } else {
                const firstSocial = this.form.data.validacaoRedes[0];
                if (!firstSocial.socialMedia || firstSocial.socialMedia.trim() === '') {
                    this.form.validation.errors.socialMedia = 'Rede Social é obrigatória';
                    isValid = false;
                }

                if (!firstSocial.link || firstSocial.link.trim() === '') {
                    this.form.validation.errors.link = 'Link da rede social é obrigatório';
                    isValid = false;
                }
            }

            if (this.form.data.email && !this.isValidEmail(this.form.data.email.trim())) {
                this.form.validation.errors.email = 'E-mail com formato inválido';
                isValid = false;
            }

            if (this.form.data.password && this.form.data.password.length < 6) {
                this.form.validation.errors.password = 'Senha deve ter pelo menos 6 caracteres';
                isValid = false;
            }

            if (this.form.data.phone && !this.isValidPhone(this.form.data.phone)) {
                this.form.validation.errors.phone = 'Telefone com formato inválido';
                isValid = false;
            }
            if (!isValid) {
                const firstError = Object.values(this.form.validation.errors)[0];
                this.form.validation.error = firstError;
            }

            return isValid;
        },

        prepareDataForSubmission() {
            const cleanData = {};

            Object.keys(this.form.data).forEach(key => {
                const value = this.form.data[key];

                if (value !== undefined && value !== null) {
                    if (typeof value === 'string') {
                        const trimmed = value.trim();
                        if (trimmed !== '') {
                            switch (key) {
                                case 'email':
                                    cleanData[key] = trimmed.toLowerCase();
                                    break;
                                default:
                                    cleanData[key] = trimmed;
                            }
                        }
                    } else {
                        cleanData[key] = value;
                    }
                }
            });
            return cleanData;
        },

        formCreateUser() {
            this.error = "";
            this.success = "";

            this.validadeRedes()

            if (this.selectedCount >= 2 && this.validadeRedes()) {
                this.isLoading = true;

                const now = new Date();
                const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
                this.formData.date_subscription = formattedDate;

                fetch('https://creators.llc/api/v1/users', {
                    method: 'POST',
                    body: JSON.stringify(this.formData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        this.isLoading = false;

                        if (data.error) {
                            if (data.error.email && Array.isArray(data.error.email) && data.error.email.length > 0) {
                                this.error = data.error.email[0];
                            }
                            else if (data.error.password && Array.isArray(data.error.password) && data.error.password.length > 0) {
                                this.error = data.error.password[0];
                            }
                            else if (data.error.message) {
                                this.error = data.error.message;
                            }
                            else if (typeof data.error === 'string') {
                                this.error = data.error;
                            }
                            else {
                                const firstErrorField = Object.keys(data.error)[0];
                                if (firstErrorField && Array.isArray(data.error[firstErrorField]) && data.error[firstErrorField].length > 0) {
                                    this.error = data.error[firstErrorField][0];
                                } else {
                                    this.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
                                }
                            }

                        } else {
                            this.formUpdateUser(data.data.access_token, data.data.user.id);
                        }
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.error = 'Erro de conexão. Tente novamente.';
                    });
            } else {
                if (this.selectedCount < 2) {
                    this.error = 'É necessário selecionar no mínimo 2 verticais do seu conteúdo.';
                } else {
                    this.error = 'É necessário selecionar no mínimo 1 rede.';
                }
            }
        },

        handleNetworkError(error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.form.validation.error = 'Erro de conexão. Verifique sua internet.';
            } else if (error.message.includes('HTTP Error')) {
                this.form.validation.error = 'Erro no servidor. Tente novamente.';
            } else {
                this.form.validation.error = 'Erro interno do servidor';
            }
        },

        handleCreateUserError(errors) {
            this.form.validation.isLoading = false;
            this.form.validation.errors = {};
            this.form.validation.error = '';

            if (!errors || typeof errors !== 'object') {
                this.form.validation.error = 'Erro desconhecido do servidor';
                return;
            }
            let firstErrorMessage = '';

            Object.keys(errors).forEach(field => {
                const fieldErrors = errors[field];
                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    this.form.validation.errors[field] = fieldErrors[0];

                    if (!firstErrorMessage) {
                        firstErrorMessage = `${this.getFieldLabel(field)}: ${fieldErrors[0]}`;
                    }
                } else if (typeof fieldErrors === 'string') {
                    this.form.validation.errors[field] = fieldErrors;
                    if (!firstErrorMessage) {
                        firstErrorMessage = `${this.getFieldLabel(field)}: ${fieldErrors}`;
                    }
                }
            });

            this.form.validation.error = firstErrorMessage || 'Erro de validação';
        },

        getFieldLabel(fieldName) {
            const labels = {
                'name': 'Nome',
                'email': 'E-mail',
                'phone': 'Telefone',
                'socialMedia': 'Rede Social',
                'link': 'Link',
                'specialities': 'Especialidades',
                'password': 'Senha'
            };

            return labels[fieldName] || fieldName;
        },

        async handleLoginResponse(response) {
            if (!response) {
                this.form.validation.isLoading = false;
                return;
            }
            const data = await response;
            if (data?.data?.user) {
                this.formUpdateUser(data.data.access_token, data.data.user.id);
            }
        },
        handleLoginError(error) {
            this.form.validation.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
            this.form.validation.isLoading = false;
        },

        prepareSocialMediaData() {
            this.form.data.validacaoRedes.forEach(element => {
                this.form.data[element.socialMedia] = this.getBaseLink(element.socialMedia) + element.link;
            });
        },

        formUpdateUser(token, id) {
            this.formData.validacaoRedes.forEach(element => {
                this.formData[element.socialMedia] = this.getBaseLink(element.socialMedia) + element.link;
            });
            fetch('https://creators.llc/api/v1/users/' + id, {
                method: 'PUT',
                body: JSON.stringify(this.formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao atualizar usuário');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        this.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
                        this.isLoading = false;
                    } else if (!data.error) {
                        this.success = 'Inscrição efetuada com sucesso!';
                        this.isLoading = false;

                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.error('Erro na solicitação:', error);
                });
        },

        async formForgot() {
            if (!this.form.data.email) {
                this.form.validation.error = 'Preencha um email válido';
                return;
            }
            try {
                const response = await this.makeAPIRequest('/password/create', {
                    method: 'POST',
                    body: JSON.stringify({ email: this.form.data.email })
                });
                const data = await response.json();

                if (data.data?.message) {
                    this.form.validation.success = data.data.message;
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    this.error = data?.error?.message;
                    this.form.data.email = '';  
                    setTimeout(() => {
                        this.error = ''
                    }, 2000);
                }
            } catch (error) {
                this.form.validation.error = 'Erro ao enviar email de recuperação, e-mail não encontrado';
            }
        },
        makeAPIRequest(endpoint, options = {}) {
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            return fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options
            });
        },

        validateForm() {
            const isValidSocialMedia = this.validateSocialMedia();
            if (!isValidSocialMedia) {
                this.form.validation.error = 'Se preencheu uma rede social, complete todas as informações (tipo e link).';
                return false;
            }
            return true;
        },

        resetFormMessages() {
            this.form.validation.error = '';
            this.form.validation.errors = {};
            this.form.validation.isLoading = false;
        },
        getCurrentDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        updateSelectedCount() {
            this.form.validation.selectedCount = this.form.data.specialities.length;
        },
        toggleFieldsVisibility() {
            this.resetFormMessages();
            this.ui.showAllFields = !this.ui.showAllFields;
            this.activate = false;
            this.form.data.name = '';
            this.form.data.email = '';
            this.form.data.phone = '';          
            this.form.data.password = '';       
        },
        toggleReturn() {
            this.resetFormMessages();
        },
        validadeRedes() {
            return this.validateSocialMedia();
        },
        loadGoogleAnalytics() {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) },
                    i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

            ga('create', ANALYTICS_ID, 'auto');
            ga('send', 'pageview');
        },
        loadGoogleTagManager() {
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', GTM_ID);
        }
    },

    computed: {
        selectedVerticals() {
            const selectedIds = this.form.data.specialities.map(Number);
            return this.verticals.filter(v => selectedIds.includes(v.id));
        },
        isFormValid() {
            const { name, email, phone, password } = this.formData;

            return name.trim() !== '' &&
                email.trim() !== '' &&
                phone.trim() !== '' &&
                phone.length >= 14 &&
                password.trim() !== '';
        },


        navStyle() {
            const baseStyle = { backgroundColor: "#FFFFFF" };

            if (this.ui.scrolled) {
                return {
                    ...baseStyle,
                    position: 'fixed',
                    top: '0',
                    width: '100%',
                    zIndex: '1',
                    paddingBottom: '20px'
                };
            }

            return baseStyle;
        },

        formData() {
            return this.form.data;
        },

        scrolled() {
            return this.ui.scrolled;
        },

        isMenuOpen() {
            return this.ui.isMenuOpen;
        },

        showAllFields() {
            return this.ui.showAllFields;
        },

        showingTooltip() {
            return this.ui.showingTooltip;
        },

        loading() {
            return this.ui.loading;
        },

        isBlocked() {
            return this.ui.isBlocked;
        },

        passwordStrength() {
            return this.form.validation.passwordStrength;
        },

        selectedCount() {
            return this.form.validation.selectedCount;
        },

        inputCode() {
            return this.verification.inputCode;
        },

        errorMessage() {
            return this.verification.errorMessage;
        },

        vertical() {
            return this.verticals;
        },
    }
}).mount('#app');