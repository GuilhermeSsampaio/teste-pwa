import React, { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Logo from '../public/logo.svg'
import TextCapitulos from './TextCapitulos'
import { SearchBar } from "./SearchBar.jsx"
import { SearchResultsList } from "./SearchResultsList.jsx"
import { Modal } from './Modal.jsx'

export const Capitulos = () => {
    //Importação das Imagens
    var LogoIF = require('../public/ifms-dr-marca-2015.png');
    var LogoEmbrapa = require('../public/logo-embrapa-400.png');
    var LogoIFEmbrapa = require('../public/logo-if-embrapa.png');

    const router = useRouter();
    const { query } = router;
    const { asPath } = router;

    const [results, setResults] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [data, setData] = useState([]);
    const [activeTitle, setActiveTitle] = useState(null);
    const [showSummary, setShowSummary] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleTitleClick = (titleId) => {
        setActiveTitle(titleId);
        localStorage.setItem('activeChapter', titleId.toString()); // Armazena o ID no localStorage
    };    

    const openSidebar = () => {
        setIsOffcanvasOpen(true);
    };    

    const handleToggle = () => {
        setIsCollapsed((prevState) => !prevState);
    };  

    const handleToggleBackDrop = () => {
        setIsOffcanvasOpen((prevState) => !prevState);
    };
    
    const toggleSummaryAndMainMenu = () => {
        setShowSummary(!showSummary);
    };

    const handleCloseResults = () => {
        setResults([]); // Limpa os resultados
    };

    //Função para quando o usuário clicar no botão "← Voltar para o menu principal"
    const handleToggleMainNavbar = () => {
        const mainNavbarOptionsMenu = document.getElementById('main-navbar-options-menu');
        const summary = document.getElementById('summary');
      
        if (mainNavbarOptionsMenu && summary) {
          mainNavbarOptionsMenu.style.display = 'block';
          summary.style.display = 'none';
        }
    };

    //Função para quando o usuário quiser fechar o sidebar
    const closeSidebar = () => {
        const sidebarMenu = document.getElementById("sidebarMenu");
        if (sidebarMenu) {
          sidebarMenu.classList.remove("show");
        }
        setIsOffcanvasOpen(false);
    }
   
    //useEffect para quando o usuário quiser fechar ou abrir os itens dentro do sumário do sidebar
    useEffect(() => {
        const anchorElement = document.getElementById('collapseExample1');
      
        if (anchorElement) {
            if (isCollapsed) {
                anchorElement.classList.add('collapse');
            } else {
                anchorElement.classList.remove('collapse');
          }
        }
      
        const backButton = document.getElementById('back-button');
        backButton.addEventListener('click', handleToggleMainNavbar);
      
        return () => {
            backButton.removeEventListener('click', handleToggleMainNavbar);
        };
    }, [isCollapsed]);

    //Puxando a API
    useEffect(() => {
        CarregaCapitulos();
    }, []);

    useEffect(() => {
        const chapterNumber = extractChapterNumberFromAnchor(asPath);
        if (chapterNumber !== null) {
            setActiveTitle(chapterNumber);
        }
    }, [asPath]);

    const extractChapterNumberFromAnchor = (path) => {
        const match = path.match(/#capitulo_(\d+)/);
        return match ? parseInt(match[1]) : null;
    };

    // const updateDataLocally = (data) => {
    //     localStorage.setItem('capitulos', JSON.stringify(data));
    // };

    const abrirBancoDeDados = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("meu-banco-de-dados", 1);
            request.onerror = (event) => {
                reject(event.target.error);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("capitulos")) {
                    db.createObjectStore("capitulos", { keyPath: "id" });
                }
            };
        });
    };
    
    const updateDataLocally = async (data) => {
        try {
            const db = await abrirBancoDeDados();
            const transaction = db.transaction(["capitulos"], "readwrite");
            const store = transaction.objectStore("capitulos");
            data.forEach(item => {
                store.add(item);
            });
        } catch (error) {
            console.error("Erro ao atualizar dados localmente:", error);
        }
    };
    
    const obterDadosDoIndexedDB = async () => {
        try {
            const db = await abrirBancoDeDados();
            const transaction = db.transaction(["capitulos"], "readonly");
            const store = transaction.objectStore("capitulos");
            const request = store.getAll();
            return new Promise((resolve, reject) => {
                request.onsuccess = function(event) {
                    resolve(event.target.result);
                };
                request.onerror = function(event) {
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error("Erro ao obter dados do IndexedDB:", error);
            return [];
        }
    };
    

    const CarregaCapitulos = async () => {

    //     if (!navigator.onLine) {
    //         // O usuário está offline, carregue os dados do armazenamento local
    //         const storedData = localStorage.getItem('capitulos');
    //         if (storedData) {
    //             setData(JSON.parse(storedData));
    //             return;
    //         }
    //     }

    //     //const url = 'https://tecnofam-strapi.a.cnpgc.embrapa.br/api/capitulos?populate=*';
    //     // const url = 'https://api-cartilha-teste-production.up.railway.app/api/capitulos?populate=*'
    // // O usuário está online, faça a solicitação à API
    //     const url = 'https://api-cartilha-teste.onrender.com/api/capitulos?populate=*';
    //     try {
    //         const response = await fetch(url);
    //         if (response.ok) {
    //             const json = await response.json();
    //             const data = json.data;
    //             setData(data);
    //             // Armazene os dados no armazenamento local para uso offline
    //             localStorage.setItem('capitulos', JSON.stringify(data));
    //             updateDataLocally(data);

    //         } else {
    //             throw new Error('Falha na requisição. Código de status: ' + response.status);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         if (!navigator.onLine) {
    //             // O usuário está offline, exiba uma mensagem de erro
    //             console.log('Você está offline. Verifique sua conexão com a Internet e tente novamente.');
    //         } else {
    //             // Ocorreu um erro na solicitação à API
    //             console.error('Erro ao carregar os dados da API:', error.message);
    //         }
    //     }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                let storedData = [];
                if (!navigator.onLine) {
                    // O usuário está offline, tenta carregar os dados do IndexedDB
                    storedData = await obterDadosDoIndexedDB();
                } else {
                    // O usuário está online, faz a solicitação à API
                    const response = await fetch('https://api-cartilha-teste.onrender.com/api/capitulos?populate=*');
                    if (response.ok) {
                        const json = await response.json();
                        storedData = json.data;
                        // Atualiza os dados no IndexedDB para uso offline
                        await updateDataLocally(storedData);
                    } else {
                        throw new Error('Falha na requisição. Código de status: ' + response.status);
                    }
                }
                setData(storedData);
            } catch (error) {
                console.error(error);
                if (!navigator.onLine) {
                    // O usuário está offline, exibe uma mensagem de erro
                    console.log('Você está offline. Verifique sua conexão com a Internet e tente novamente.');
                } else {
                    // Ocorreu um erro na solicitação à API
                    console.error('Erro ao carregar os dados da API:', error.message);
                }
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTitle === null) {
            // Verifique se data não é nulo e se tem pelo menos um elemento
            if (data && data.length > 0) {
              // Se for nulo, defina-o como o primeiro capítulo da API
              setActiveTitle(data[0].id);
        
              // Use useRouter para navegar para o capítulo ativo
              router.push(`/edicao-completa?activeChapter=${data[0].id}`, undefined, { shallow: true });
            }
          }
        scrollToTop();
    }, [activeTitle, data, router]);

    // Função para rolar a página para o topo
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Adicionando um efeito de rolagem suave
        });
    };

    const activeChapter = data.find(item => item.id === activeTitle);
    const displayedTitle = activeChapter ? activeChapter.attributes.title : 'Título do Capítulo';

    return(
        <>
            <Head>
                <meta name="referrer" referrerPolicy="no-referrer" />
                <title>TecnofamApp</title>
            </Head>
            
            {showModal && <Modal onClose={() => setShowModal(false)} />}

            {/* Div que Pega todo o Conteúdo da Página */}
            {/* Beta */}
                <div>
                    <a data-v-b58a293a="" type='button' id="vue-ribbon-40" title="BETA" data-ribbon="BETA" class="vue-ribbon right-top" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleOpenModal}>BETA</a>
                </div>
            {/* Fim Beta */}
            <div className="container-wrapper">
                {/* Código Sidebar */}
                <nav id="sidebarMenu" className={`collapse d-lg-block sidebar bg-white thin-scrollbar ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1">
                    <div className="position-sticky">
                        <div id="summary" className="list-group list-group-flush mt-2 py-2 menu_SIkG" style={{ display: showSummary ? 'block' : 'none' }}>
                            {/* Logo IF / Embrapa Dentro do Menu */}
                            <div className='logo-container-fixed'>
                                <div className="logo-container d-flex align-items-center justify-content-between">
                                    <Link href="/home">
                                        <Image className="img-sidebar-top mx-3" src={LogoIFEmbrapa} alt="logo Embrapa com letras em azul com um símbolo verde, sendo que as letras em cima do símbolo são brancas" width="45%" height={46} priority/>
                                    </Link>
                                    <button id="btn-close-sidebar" type="button" className="btn-close btn-close-dark btn-close-cap" data-bs-dismiss="collapse" aria-label="Close" onClick={() => { closeSidebar(); setShowSummary(true); }}></button>
                                </div>
                            </div>
                            <hr className="featurette-divider line-menu"></hr>
                            {/* Botão para Retornar as Opções "Edição Completa e Autores" | Opção Disponível quando a Tela é Menor que 992px */}
                            <button type="button" className="clean-btn navbar-sidebar__back" id="back-button" onClick={() => setShowSummary(true)}>← Voltar para o menu principal</button>
                            {/* Dropdown do Sumário */}
                            <div>
                                <a 
                                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ripple ${
                                    isCollapsed ? 'collapsed' : ''
                                    }`}
                                    aria-current="true"
                                    onClick={handleToggle}
                                >
                                    <span className="w-100 text-primary">Sumário</span>{' '}
                                    <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'down'} icon-deg`}></i>
                                </a>
                                {/* Conteúdo do Sidebar, dentro do Dropdown Sumário */}
                                {data.length > 0 ? (
                                data.map((item) => (
                                    <ul key={item.id} id="collapseExample1"
                                        className={`list-group list-group-flush mx-2 py-1 ${isCollapsed ? 'collapse' : 'show'}`}
                                    >
                                        <li className={`list-group-item py-2 ${activeTitle === item.id ? 'active' : ''}`}
                                            onClick={() => { handleTitleClick(item.id); setIsOffcanvasOpen(false);}}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <a 
                                                href={`#capitulo_${item.id}`} 
                                                className={activeTitle === item.id ? 'active-link-summary' : ''}
                                            >
                                                {item.attributes.title}
                                            </a>
                                        </li>
                                    </ul>
                                ))
                                ) : (
                                    <p className='d-flex justify-content-center' style={{marginTop: 20}}>Carregando dados...</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Opções Retornadas quando o Usuário Aperta no Botão "← Voltar para o menu principal" */}
                    <div id='main-navbar-options-menu' style={{ marginTop: 16, display: showSummary ? 'none' : 'block' }}>
                        <div className="logo-container d-flex align-items-center justify-content-between">
                            <Link href="/home">
                                <Image className="img-sidebar-top mx-3" src={LogoIFEmbrapa} alt="logo Embrapa com letras em azul com um símbolo verde, sendo que as letras em cima do símbolo são brancas" width="45%" height={46} priority/>
                            </Link>
                            <button id="btn-close-sidebar" type="button" className="btn-close btn-close-dark btn-close-cap" data-bs-dismiss="sidebar" aria-label="Close" onClick={closeSidebar}></button>
                        </div>
                        <hr className="featurette-divider line-menu"></hr>
                        <button type="button" className="clean-btn navbar-sidebar__back" id="back-button" onClick={toggleSummaryAndMainMenu}>← Voltar para o Sumário</button>
                        <ul className="navbar-nav ms-auto d-flex itens-menu-cap">
                            <li className="nav-item mx-3">
                                <Link className="nav-link back-item-link py-2" href="/edicao-completa" aria-current="page">
                                    <span className="link-text">Edição Completa</span>
                                </Link> 
                            </li>
                            <li className="nav-item mx-3">
                                <Link className="nav-link back-item-link py-2" href="/autores" aria-current="page">
                                    <span className="link-text">Autores</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Código Navbar */}
                <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#sidebarMenu"
                            aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle Offcanvas" onClick={handleToggleBackDrop}>
                            <i className="fas fa-bars"></i>
                        </button>
                        {/* Logo Navbar */}
                        <Link className="navbar-brand" href="/home">
                            <Image src={Logo} width="100%" height={26} alt="logo Embrapa com letras em azul com um simbolo verde, sendo que as letras em cima do simbolo são brancas"/>
                        </Link>
                        {/* Código dos Itens Exibidos no Navbar */}
                        <ul className="navbar-nav ms-auto d-flex flex-row">
                            <li className="nav-item text-item-link">
                                <Link className="nav-link back-item-link" href="/edicao-completa" aria-current="page">
                                    <span className="link-text">Edição Completa</span>
                                </Link> 
                            </li>
                            <li className="nav-item text-item-link">
                                <Link className="nav-link back-item-link" href="/autores" aria-current="page">
                                    <span className="link-text">Autores</span>
                                </Link>
                            </li>
                            {/* Input Search para tela maior que 992px */}
                            <div className="hide-form-search2">
                                <form className="d-flex rounded-pill position-relative first-form-search" role="search">
                                    <div className="search-bar-container p-1">
                                        <SearchBar setResults={setResults} />
                                        {results && results.length > 0 && <SearchResultsList results={results} handleCloseResults={handleCloseResults} />}
                                    </div>
                                </form>
                            </div>

                            <li className="nav-item">
                                <Image src={LogoIF} className='logotipo img' width={130} height={35} alt="Logotipo do IFMS Campus Dourados" priority/>
                            </li>
                            <li className="nav-item me-lg-0">
                                <Image src={LogoEmbrapa} className='logotipo img' width={70} height={48} alt="Logotipo da Embrapa" priority/>
                            </li>

                            {/* Input Search para tela menor que 992px */}
                            <form className="d-flex rounded-pill position-relative" role="search">
                                <div className="input-group hide-form-search">
                                    <div className="search-bar-container">
                                        <SearchBar setResults={setResults} />
                                        {results && results.length > 0 && <SearchResultsList results={results}  handleCloseResults={handleCloseResults} />}
                                    </div>
                                </div>
                            </form>
                        </ul>
                    </div>
                    {isOffcanvasOpen && <div className="offcanvas-backdrop show" onClick={handleToggleBackDrop}></div>}
                </nav>
                
                {/* Conteúdo da Cartilha */}
                <main className='docMainContainer_gTbr'>
                    <div className='container padding-bottom--lg'>
                        <div className='col'>
                            <nav className="home-section" aria-label="Breadcrumbs" style={{marginTop: 120}}>    
                                {/* Código Navegação Estrutural | Trilha de Navegção do Usuário */}
                                <ul className="breadcrumbs">
                                    <li className="breadcrumbs__item">
                                        <Link href="/home" className="breadcrumbs__link">
                                            <i className="fas fa-home" style={{fontSize: '13px'}}></i>
                                        </Link>
                                        <i className="fas fa-chevron-right" style={{fontSize: '10px'}}></i>
                                    </li>
                                    <li className="breadcrumbs__item">
                                        <span className="breadcrumbs__link">Sumário</span>
                                        <meta itemProp="position" content="1" />
                                        <i className="fas fa-chevron-right" style={{fontSize: '10px'}}></i>
                                    </li>
                                    <li className="breadcrumbs__item breadcrumbs__item--active">
                                        <span className="breadcrumbs__link" itemProp="name">
                                            {displayedTitle}
                                        </span>
                                        <meta itemProp="position" content="2" />
                                    </li>
                                </ul>
                            </nav>
                            <section className="home-section right-sidebar" style={{marginTop: 30}}>
                                {/* Código dos Textos da Cartilha */}
                                <div id="contents" className="bd-content ps-lg-2">
                                    <TextCapitulos lista = {data} activeTitle={activeTitle} setActiveTitle={setActiveTitle} />
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Código Footer Embrapa */}  
            <footer>
                <div className="container container-footer bottom-0 end-0">
                    <div className="title-footer">
                        <p>Embrapa Agropecuária Oeste</p>
                    </div>
                    <div className="description-footer">
                        <p>Rodovia BR 163, Km 253,6, Caixa Postal 449, CEP: 79804-970, Dourados, MS</p>
                        <p>Fone: + 55 (67) 3416-9700</p>
                    </div>
                </div>
            </footer>
        </>
    );
};
