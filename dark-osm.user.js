// ==UserScript==
// @name        LSS Dark OSM
// @version     1.0.0
// @description Sets a dark OSM Map
// @author      Jan (jxn_30)
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle('.leaflet-tile-pane{filter: brightness(60%) invert(100%) contrast(300%) hue-rotate(200deg) saturate(30%) brightness(50%) contrast(125%) saturate(500%);}');
