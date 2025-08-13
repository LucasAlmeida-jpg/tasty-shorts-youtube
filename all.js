const { createApp } = Vue
createApp({
    data() {
        return {
            images: [],
            interval: null,
            random: null,
            loading: true,
            video: false,
            showModal: false,
            activeIndex: null,
            creatorsForm: false,
            activeIndex: null,
            isMenuOpen: false,
            navStyle: {},
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
            formData: {
                name: "",
                email: "",
                password: "",
                phone: "",
                perfil: "",
                origin: "druid",
                date_subscription: "",
                specialities: [],
                validacaoRedes: [
                    { socialMedia: '', link: '' }
                ]
            },
            passwordStrength: '',
            showingTooltip: false,
            isLoading: false,
            success: '',
            error: '',
            selectedCount: 0,
            selectedSocialMedia: '',
            socialMediaInput: '',
            showAllFields: true,
            scrolled: false,
            vertical: [
                { name: "Beleza", id: 263 },
                { name: "Casa", id: 306 },
                { name: "Decoração", id: 307 },
                { name: "Esporte", id: 305 },
                { name: "Fitness", id: 264 },
                { name: "Games", id: 362 },
                { name: "Moda", id: 323 },
                { name: "Tecnologia", id: 368 },
            ],
            isBlocked: true,
            inputCode: '',
            correctCode: '',
            errorMessage: '',
        }
    },

    mounted() {
        this.loadGoogleAnalytics();
        this.loadGoogleTagManager();
        document.addEventListener('click', this.handleClickOutside);
        let preview = this.$refs.preview;
        if (preview) {
            preview.play();
        }
        AOS.init();
        window.addEventListener('scroll', () => {
            this.scrolled = window.scrollY > 0;
        });
    },

    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;            
            if (this.isMenuOpen) {
                setTimeout(() => {
                    const collapseElement = document.getElementById('navbarMenu');
                    if (collapseElement && collapseElement.classList.contains('show')) {
                        setTimeout(() => {
                            this.isMenuOpen = false;
                        }, 300);
                    }
                }, 100);
            }
        },
        handleClickOutside(event) {
            const navbar = document.querySelector('.navbar-collapse');
            const toggler = document.querySelector('.navbar-toggler');
            
            if (navbar && !navbar.contains(event.target) && !toggler.contains(event.target)) {
                if (navbar.classList.contains('show')) {
                    this.isMenuOpen = false;
                }
            }
        },
        
        handleScroll() {
            this.scrolled = window.scrollY > 50;
        },
        toggleAccordion(index) {
            this.activeIndex = this.activeIndex === index ? null : index;
        },
        playVideo() {
            this.video = true;
            this.loading = false;

            if (this.$refs.preview) {
                this.$refs.preview.pause();
            }

            this.$nextTick(() => {
                const mainVideo = this.$refs.video;
                if (mainVideo) {
                    mainVideo.volume = 0.7;
                    mainVideo.play();
                    this.goFullScreen('myVideo');
                }
            });
        },

        paused() {
            this.video = false;
            if (this.$refs.preview) {
                this.$refs.preview.play();
            }
        },

        closeFullscreen() {
            this.video = false;
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.video = false
        },
        goFullScreen(id) {
            let element = document.getElementById(id);
            if (!element) return;

            if (/iPad|iPhone|iPod/.test(navigator.platform)) {
                element.play();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.requestFullscreen) {
                element.requestFullscreen(); 
            }
        },
        loadGoogleAnalytics() {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date(); a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
            ga('create', 'UA-90265209-1', 'auto');
            ga('send', 'pageview');
        },
        loadGoogleTagManager() {
            (function (w, d, s, l, i) {
                w[l] = w[l] || []; w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                }); var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                        'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-58WRXZQ');
        },
        loadFormFacade() {
            const script = document.createElement('script');
            script.src = 'https://formfacade.com/include/109343391720390960505/form/1FAIpQLSevqxJvkYyuPS6BbyqopNCgzc_gyBw5nH6pNUAsMrIRYB07sQ/bootstrap.js?div=ff-compose';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        },

        closeModal() {
            this.showModal = false;
        },
        formatTelefone() {
            this.formData.phone = this.formData.phone.replace(/\D/g, '');
            let phoneNumber = this.formData.phone;

            if (phoneNumber.length >= 2) {
                this.formData.phone = `(${phoneNumber.substring(0, 2)}`;
            }

            if (phoneNumber.length > 2) {
                this.formData.phone += `) ${phoneNumber.substring(2, 7)}`;
            }

            if (phoneNumber.length > 7) {
                this.formData.phone += `-${phoneNumber.substring(7, 11)}`;
            }
        },

        verifyCode() {
            if (this.inputCode === this.correctCode) {
                this.isBlocked = false;
                localStorage.setItem('isAuthenticated', true);
            } else {
                this.errorMessage = 'Senha incorreta. Tente novamente.';
            }
        },

        checkPasswordStrength() {
            const password = this.formData.password;
            if (password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
                this.passwordStrength = 'Forte';
            } else if (password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password)) {
                this.passwordStrength = 'Média';
            } else {
                this.passwordStrength = 'Fraca';
            }
        },

        showTooltip() {
            this.showingTooltip = true;
        },

        hideTooltip() {
            this.showingTooltip = false;
        },

        updateSelectedCount() {
            this.selectedCount = this.formData.specialities.length;
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
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 401) {
                            this.error = 'Ocorreu um erro no login. Por favor, verifique se o e-mail e senha estão corretos.';
                        }
                        this.isLoading = false;
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    if (data) {
                        if (data.data.user && data.data.user.date_subscription == null) {
                            const now = new Date();
                            const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
                            this.formData.date_subscription = formattedDate;

                            this.formUpdateUser(data.data.access_token, data.data.user.id);
                        } else {
                            this.isLoading = false;
                            this.success = "E-mail já inscrito!";
                        }
                    }
                })
                .catch(error => {
                    this.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
                    this.isLoading = false;
                });
        },

        formUpdateUser(token, id) {
            this.formData.validacaoRedes.forEach(element => {
                this.formData[element.socialMedia] = this.getBaseLink(element.socialMedia) + element.link;
            });
            console.log(this.formData)
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

        formForgot() {
            if (this.formData.email == "") {
                this.error = 'Preencha um email válido';
            } else {
                const requestBody = {
                    email: this.formData.email
                };

                fetch('https://creators.llc/api/password/create', {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao atualizar usuário');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.data && data.data.message) {
                            const successMessage = data.data.message;
                            this.success = successMessage;
                        } else {
                            throw new Error('Resposta do servidor incompleta ou sem mensagem');
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                    });
            }
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
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao criar usuário');
                        }
                        return response.json();
                    })
                    .then(data => {

                        if (data.error) {
                            if (data.error.email) {
                                if (Array.isArray(data.error.email) && data.error.email.length > 0) {
                                    const errorMessage = data.error.email[0];
                                    this.error = errorMessage;
                                }
                            } else {
                                this.error = 'Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente mais tarde.';
                            }
                            this.isLoading = false;
                        } else {
                            this.formUpdateUser(data.data.access_token, data.data.user.id);
                        }
                    })
            } else {
                if (this.selectedCount < 1) {
                    this.error = 'É necessário selecionar no mínimo 1 rede.';
                } else {
                    this.error = 'É necessário selecionar no mínimo 2 verticais do seu conteúdo.';
                }
            }
        },

        validadeRedes() {
            if (Array.isArray(this.formData.validacaoRedes) && this.formData.validacaoRedes.length > 0) {
                const primeiroElemento = this.formData.validacaoRedes[0];
                const socialMediaVazia = primeiroElemento.socialMedia.trim() === '';
                const linkVazio = primeiroElemento.link.trim() === '';

                if (socialMediaVazia || linkVazio) {
                    return false

                }
            } else {
                return false
            }
            return true
        },

        toggleReturn() {
            this.error = "";
            this.success = "";
        },

        toggleFieldsVisibility() {
            this.error = "";
            this.success = "";
            this.showAllFields = !this.showAllFields;
        },

        addSocialMedia() {
            if (this.formData.validacaoRedes.length < 2) {
                this.formData.validacaoRedes.push({ socialMedia: '', link: '' });
            }
        },

        removeSocialMedia() {
            if (this.formData.validacaoRedes.length > 1) {
                this.formData.validacaoRedes.pop();
            }
        },
        getBaseLink(socialMedia) {
            if (socialMedia === 'instagram') {
                return 'https://www.instagram.com/';
            } else if (socialMedia === 'youtube') {
                return 'https://www.youtube.com/';
            } else if (socialMedia === 'tiktok') {
                return 'https://www.tiktok.com/';
            } else if (socialMedia === 'twitch') {
                return 'https://www.twitch.tv/';
            }
            return '';
        },
    },

    computed: {
        selectedVerticals() {
            const selectedIds = this.formData.specialities.map(Number);
            return this.vertical.filter((v) => selectedIds.includes(v.id));
        },
        isValid() {
            const vertical = this.selectedCount >= 2;
            const redes = this.formData.validacaoRedes.length >= 1;


            return [vertical, redes];
        },
        navStyle() {
            if (!this.scrolled) {
                console.log(this.scrolled);
                return {
                    backgroundImage: "url('./assets/main/youtube-bg.png')"                
                };
            }
            if (this.scrolled) {
                return {
                    position: 'fixed',
                    backgroundImage: "url('./assets/main/youtube-bg.png')",
                    top: '0',
                    width: '100%',
                    zIndex: '1',
                    paddingBottom: '20px'
                };
            }
            return {};
        }
    },


}).mount('#app')