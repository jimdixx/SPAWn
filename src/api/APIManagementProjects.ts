import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const PROJECT_URL = "/management/projects"

export interface ProjectData {
    project: {
        id: number,
        name: string,
        description: string
    },
    children: ProjectData[],
    parent?: ProjectData
}

export const fetchProjects = async (username:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({name:username});
    // const response: API_RESPONSE = await ApiCaller(data, PROJECT_URL, HTTP_METHOD.POST);
    return API_RESPONSE2;
}

const API_RESPONSE2 = {
    authenticated: true,
    response: {
        status: 200,
        data: [
            {
                "project": {
                    "id": 1,
                    "name": "Aplikace pro Centrum blízkovýchodních studií (FF) - Medici",
                    "description": ""
                },
                "children": []
            },
            {
                "project": {
                    "id": 2,
                    "name": "Roz?í?ení nástroje IMiGEr (KIV) - HKMM",
                    "description": ""
                },
                "children": []
            },
            {
                "project": {
                    "id": 3,
                    "name": "Interní podpora mzdové agendy (Oso Oy)",
                    "description": ""
                },
                "children": []
            },
            {
                "project": {
                    "id": 4,
                    "name": "Aplikace pro tvorbu map obslu?nosti (POVED) - QWERTY",
                    "description": ""
                },
                "children": []
            },
            {
                "project": {
                    "id": 6,
                    "name": "Aplikace nad otev?enými daty (KIV) ? BHVS",
                    "description": "V rámci iniciativ Z?U, magistrát?, ministerstev apod. jsou k dispozici tzv. otev?ená data, nad kterými je mo?no vytvá?et r?zné -- potenciáln? pro obecnou ve?ejnost u?ite?né -- softwarové aplikace. V rámci tohoto volného tématu je cílem inspirovat se aplikacemi p?ihlá?enými do ?Spole?n? otevíráme data? (https://osf.cz/seznam-prihlasenych-aplikaci-sod-2019/), vyu?ít open data Z?U a Plzn? (http://opendata.zcu.cz a https://opendata.plzen.eu), navrhnout a v p?ípad? schválení vyu?ujícími p?edm?tu realizovat aplikaci ?i slu?bu pro jejich zpracování."
                },
                "children": []
            },
            {
                "project": {
                    "id": 7,
                    "name": "Java object universal deserializer (GK Software) - Horký",
                    "description": ""
                },
                "children": []
            },
            {
                "project": {
                    "id": 8,
                    "name": "Aplikace pro muzea (FDULS) - MERLOT",
                    "description": "Muzeum (nap?. UMPRUM) by uvítalo nabídnout osobní portál u?ivatele, ve kterém si bude moci p?i pr?chodu výstavou vytvá?et seznam pro n?j nejzajímav?j?ích artefakt? a k nim pak z databáze muzea dostane pot?ebné informace. Zárove? tak muzeum získává i zp?tnou vazbu a databázi náv?t?vník?, kterým tak m??e adresn?ji posílat r?zná upozorn?ní na akce. "
                },
                "children": []
            },
            {
                "project": {
                    "id": 9,
                    "name": "Webová aplikace simulující kontingen?ní tabulku (CIV) - VLDC",
                    "description": "U?ivatelé informa?ních systém? ?asto pot?ebují jednorázové výstupy, pro které se nevyplatí vytvá?et oficiální sestavy. Ve v?t?in? p?ípad? jde jen o tabulku s n?kolika sloupci a mnoha ?ádky. Cht?li bychom tedy vytvo?it webovou aplikaci, která u?ivateli rychle umo?ní si vytvo?it vlastní jednoduchý report nad daty z informa?ního systému."
                },
                "children": []
            },
            {
                "project": {
                    "id": 11,
                    "name": "arborist",
                    "description": "npm's tree doctor"
                },
                "children": []
            },
            {
                "project": {
                    "id": 12,
                    "name": "BarcodeScanner",
                    "description": ":mag_right: A simple and beautiful barcode scanner."
                },
                "children": []
            },
            {
                "project": {
                    "id": 13,
                    "name": "ciphersweet",
                    "description": "Fast, searchable field-level encryption for PHP projects"
                },
                "children": []
            },
            {
                "project": {
                    "id": 15,
                    "name": "google-maps-ios-utils",
                    "description": "Google Maps SDK for iOS Utility Library"
                },
                "children": [
                    {
                        "project": {
                            "id": 16,
                            "name": "responsive-html-email-signature",
                            "description": "Template generator for (responsive) emails & email signatures :sparkles:"
                        },
                        "children": [
                            {
                                            "project": {
                                                "id": 5,
                                                "name": "Indexace a fulltextové vyhledávání v historických obrazových dokumentech (KIV) - ANONYMOUS",
                                                "description": "Pro podporu výzkumných projekt? pot?ebujeme vytvo?it vyhledáva? zalo?ený na platform? Apache Solr, který umo?ní efektivní fulltextové vyhledávání nad mno?inou historických dokument? (scan?) rozpoznaných OCR systémem. Sou?ástí práce bude i webová aplikace (klient / frontend) pro demonstraci funk?nosti u?ivatelsky p?ív?tivým zp?sobem, která umo?ní zadávat dotazy a také p?ehledné zobrazení výsledk? dle r?zných po?adavk?.\r\n"
                                            },
                                            "children": []
                                        }
                        ]
                    },
                     {
                                    "project": {
                                        "id": 14,
                                        "name": "CoronaTracker",
                                        "description": "Coronavirus tracker app for iOS & macOS with maps & charts"
                                    },
                                    "children": []
                                },
                ]
            }
        ]
    }
}