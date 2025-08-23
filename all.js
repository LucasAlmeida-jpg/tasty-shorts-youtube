const { createApp } = Vue;

// Constantes e configurações
const API_BASE_URL = 'https://creators.llc/api';
const ANALYTICS_ID = 'UA-90265209-1';
const GTM_ID = 'GTM-58WRXZQ';

const SOCIAL_MEDIA_URLS = {
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
            // Estado da UI
            ui: {
                loading: true,
                video: false,
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
                    cpf: "",
                    perfil: "",
                    origin: "youtube_shorts_br",
                    date_subscription: "",
                    specialities: [],
                    validacaoRedes: [{ socialMedia: '', link: '' }]
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
                    content: 'Preencha o <u>Formulário de Seleção</u> (link! do modal) e analisaremos sua inscrição.'
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
                    title: 'Sou iniciante, posso participar?',
                    content: 'Se você tem 5k+ seguidores e publica com frequência, sim! Não exigimos experiência prévia com gastronomia.'
                },
                {
                    title: 'Posso gravar com celular?',
                    content: 'Deve! As aulas vão te ensinar a extrair o melhor da câmera que você já tem no bolso.'
                },
                {
                    title: 'Quanto tempo dura o programa?',
                    content: 'O programa acontecerá durante 8 semanas, entre setembro de 2025 a novembro de 2025, com aulas ao vivo a cada quinze dias, das 19h às 20h. Os alunos terão atividades complementares e mentorias ao longo programa com horários a definir.'
                }
            ],


            verticals: [
                { name: "Beleza", id: 263 },
                { name: "Casa", id: 306 },
                { name: "Decoração", id: 307 },
                { name: "Esporte", id: 305 },
                { name: "Fitness", id: 264 },
                { name: "Games", id: 362 },
                { name: "Moda", id: 323 },
                { name: "Tecnologia", id: 368 }
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
        initializeApp() {
            this.loadAnalytics();
            this.setupEventListeners();
            this.initializeVideo();
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

        initializeVideo() {
            const preview = this.$refs.preview;
            if (preview) {
                preview.play();
            }
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

        playVideo() {
            this.ui.video = true;
            this.ui.loading = false;

            this.pausePreview();
            this.$nextTick(() => {
                this.startMainVideo();
            });
        },

        pausePreview() {
            if (this.$refs.preview) {
                this.$refs.preview.pause();
            }
        },

        startMainVideo() {
            const mainVideo = this.$refs.video;
            if (mainVideo) {
                mainVideo.volume = 0.7;
                mainVideo.play();
                this.goFullScreen('myVideo');
            }
        },

        paused() {
            this.ui.video = false;
            if (this.$refs.preview) {
                this.$refs.preview.play();
            }
        },

        closeFullscreen() {
            this.ui.video = false;
            this.exitFullscreen();
        },

        exitFullscreen() {
            const exitMethods = [
                'exitFullscreen',
                'webkitExitFullscreen',
                'msExitFullscreen'
            ];

            exitMethods.forEach(method => {
                if (document[method]) {
                    document[method]();
                }
            });
        },

        goFullScreen(id) {
            const element = document.getElementById(id);
            if (!element) return;

            if (this.isIOS()) {
                element.play();
            } else {
                this.requestFullscreen(element);
            }
        },

        isIOS() {
            return /iPad|iPhone|iPod/.test(navigator.platform);
        },

        requestFullscreen(element) {
            const fullscreenMethods = [
                'requestFullscreen',
                'mozRequestFullScreen',
                'webkitRequestFullScreen'
            ];

            fullscreenMethods.forEach(method => {
                if (element[method]) {
                    element[method]();
                }
            });
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

        formatCPF() {
            let cpf = this.form.data.cpf.replace(/\D/g, '');
            
            if (cpf.length > 3) {
                cpf = cpf.substring(0, 3) + '.' + cpf.substring(3);
            }
            if (cpf.length > 7) {
                cpf = cpf.substring(0, 7) + '.' + cpf.substring(7);
            }
            if (cpf.length > 11) {
                cpf = cpf.substring(0, 11) + '-' + cpf.substring(11, 13);
            }
            
            this.form.data.cpf = cpf.substring(0, 14);
        },

        hasFieldError(fieldName) {
            if (!this.form.validation.error) return false;
            
            const requiredFields = {
                name: () => !this.form.data.name.trim(),
                email: () => !this.form.data.email.trim() || !this.isValidEmail(this.form.data.email),
                phone: () => !this.form.data.phone.trim() || this.form.data.phone.length < 14,
                password: () => !this.form.data.password.trim() || this.form.data.password.length < 6,
                cpf: () => this.form.data.cpf && !this.isValidCPF(this.form.data.cpf)
            };

            return requiredFields[fieldName] ? requiredFields[fieldName]() : false;
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        isValidCPF(cpf) {
            cpf = cpf.replace(/[^\d]/g, '');
            
            if (cpf.length !== 11) return false;
            
            if (/^(\d)\1{10}$/.test(cpf)) return false;
            
            let sum = 0;
            let remainder;
            
            for (let i = 1; i <= 9; i++) {
                sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }
            
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.substring(9, 10))) return false;
            
            sum = 0;
            for (let i = 1; i <= 10; i++) {
                sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }
            
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.substring(10, 11))) return false;
            
            return true;
        },

        switchToLogin() {
            this.resetFormMessages();
            this.ui.showAllFields = false;
        },

        switchToRegister() {
            this.resetFormMessages();
            this.ui.showAllFields = true;
        },

        handleRegistration() {
            if (this.isRegistrationFormValid) {
                this.formCreateUser();
            }
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

        showTooltip() {
            this.ui.showingTooltip = true;
        },

        hideTooltip() {
            this.ui.showingTooltip = false;
        },

        addSocialMedia() {
            if (this.form.data.validacaoRedes.length < 2) {
                this.form.data.validacaoRedes.push({ socialMedia: '', link: '' });
            }
        },

        removeSocialMedia() {
            if (this.form.data.validacaoRedes.length > 1) {
                this.form.data.validacaoRedes.pop();
            }
        },

        getBaseLink(socialMedia) {
            return SOCIAL_MEDIA_URLS[socialMedia] || '';
        },

        validateSocialMedia() {
            if (!Array.isArray(this.form.data.validacaoRedes) || 
                this.form.data.validacaoRedes.length === 0) {
                return true; // Permite envio sem redes sociais
            }

            const firstItem = this.form.data.validacaoRedes[0];
            if (firstItem.socialMedia.trim() !== '' || firstItem.link.trim() !== '') {
                return firstItem.socialMedia.trim() !== '' && firstItem.link.trim() !== '';
            }
            
            return true; // Se não preencheu nada, está ok
        },

        // API - Autenticação
        async formLogin() {
            this.resetFormMessages();
            this.form.validation.isLoading = true;

            try {
                const response = await this.makeAPIRequest('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(this.form.data)
                });

                await this.handleLoginResponse(response);
            } catch (error) {
                this.handleLoginError(error);
            }
        },

        async handleLoginResponse(response) {
            if (!response.ok) {
                if (response.status === 401) {
                    this.form.validation.error = 'Ocorreu um erro no login. Por favor, verifique se o e-mail e senha estão corretos.';
                }
                this.form.validation.isLoading = false;
                return;
            }

            const data = await response.json();
            
            if (data?.data?.user) {
                if (data.data.user.date_subscription == null) {
                    this.form.data.date_subscription = this.getCurrentDate();
                    await this.formUpdateUser(data.data.access_token, data.data.user.id);
                } else {
                    this.form.validation.isLoading = false;
                    this.form.validation.success = "E-mail já inscrito!";
                }
            }
        },

        handleLoginError(error) {
            this.form.validation.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
            this.form.validation.isLoading = false;
        },

        async formCreateUser() {
            this.resetFormMessages();
            
            if (!this.validateForm()) {
                return;
            }

            this.form.validation.isLoading = true;
            this.form.data.date_subscription = this.getCurrentDate();

            try {
                const response = await this.makeAPIRequest('/v1/users', {
                    method: 'POST',
                    body: JSON.stringify(this.form.data)
                });

                const data = await response.json();
                
                if (data.error) {
                    this.handleCreateUserError(data.error);
                } else {
                    await this.formUpdateUser(data.data.access_token, data.data.user.id);
                }
            } catch (error) {
                this.form.validation.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
                this.form.validation.isLoading = false;
            }
        },

        handleCreateUserError(error) {
            if (error.email && Array.isArray(error.email) && error.email.length > 0) {
                this.form.validation.error = error.email[0];
            } else {
                this.form.validation.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
            }
            this.form.validation.isLoading = false;
        },

        async formUpdateUser(token, id) {
            this.prepareSocialMediaData();

            try {
                const response = await this.makeAPIRequest(`/v1/users/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify(this.form.data),
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (data.error) {
                    this.form.validation.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
                } else {
                    this.form.validation.success = 'Inscrição efetuada com sucesso!';
                    setTimeout(() => window.location.reload(), 1000);
                }
            } catch (error) {
                console.error('Erro na solicitação:', error);
            } finally {
                this.form.validation.isLoading = false;
            }
        },

        prepareSocialMediaData() {
            this.form.data.validacaoRedes.forEach(element => {
                this.form.data[element.socialMedia] = this.getBaseLink(element.socialMedia) + element.link;
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
                } else {
                    throw new Error('Resposta do servidor incompleta');
                }
            } catch (error) {
                console.error('Erro:', error);
                this.form.validation.error = 'Erro ao enviar email de recuperação';
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
            this.form.validation.error = "";
            this.form.validation.success = "";
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
        },

        verifyCode() {
            if (this.verification.inputCode === this.verification.correctCode) {
                this.ui.isBlocked = false;
                localStorage.setItem('isAuthenticated', true);
            } else {
                this.verification.errorMessage = 'Senha incorreta. Tente novamente.';
            }
        },

        toggleReturn() {
            this.resetFormMessages();
        },

        validadeRedes() {
            return this.validateSocialMedia();
        },

        loadGoogleAnalytics() {
            (function(i,s,o,g,r,a,m){
                i['GoogleAnalyticsObject']=r;
                i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},
                i[r].l=1*new Date();
                a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];
                a.async=1;
                a.src=g;
                m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
            
            ga('create', ANALYTICS_ID, 'auto');
            ga('send', 'pageview');
        },

        loadGoogleTagManager() {
            (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', GTM_ID);
        }
    },

    computed: {
        selectedVerticals() {
            const selectedIds = this.form.data.specialities.map(Number);
            return this.verticals.filter(v => selectedIds.includes(v.id));
        },

        isFormValid() {
            const socialMedia = this.validateSocialMedia();
            return [socialMedia];
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

        // UI State
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

        video() {
            return this.ui.video;
        },

        loading() {
            return this.ui.loading;
        },

        isBlocked() {
            return this.ui.isBlocked;
        },

        isLoading() {
            return this.form.validation.isLoading;
        },

        error() {
            return this.form.validation.error;
        },

        success() {
            return this.form.validation.success;
        },

        passwordStrength() {
            return this.form.validation.passwordStrength;
        },

        selectedCount() {
            return this.form.validation.selectedCount;
        },

        // Verification
        inputCode() {
            return this.verification.inputCode;
        },

        errorMessage() {
            return this.verification.errorMessage;
        },

        vertical() {
            return this.verticals;
        },

        isRegistrationFormValid() {
            return this.form.data.name.trim() && 
                   this.isValidEmail(this.form.data.email) &&
                   this.form.data.phone.trim() && 
                   this.form.data.phone.length >= 14 &&
                   this.form.data.password.trim() && 
                   this.form.data.password.length >= 6;
        },

        isLoginFormValid() {
            return this.isValidEmail(this.form.data.email) && 
                   this.form.data.password.trim() && 
                   this.form.data.password.length >= 6;
        }
    }
}).mount('#app');