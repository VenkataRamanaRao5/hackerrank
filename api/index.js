const https = require("https")
const express = require("express")
const cheerio = require('cheerio')
const cors = require('cors')

const app = express()

app.use(cors())

const icons = {
    "10-days-of-javascript-94ff22d1c9.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 98.71567 71.37783\"><defs><style>.a{fill:#39424e;}</style></defs><title>10</title><path class=\"a\" d=\"M36.04,85.8009H20.9521V44.49741l.14842-6.7843.24217-7.42095q-3.7555,3.75552-5.222,4.92906L7.91861,41.81416.64216,32.72938l22.99711-18.3063h12.4008Z\" transform=\"translate(-0.64216 -14.42308)\"/><path class=\"a\" d=\"M99.35784,50.0683q0,18.08462-5.93,26.7719a20.55925,20.55925,0,0,1-18.24327,8.68725A20.34135,20.34135,0,0,1,57.168,76.55689q-6.0622-8.96868-6.06409-26.48859,0-18.26593,5.90547-26.93432A20.45387,20.45387,0,0,1,75.1846,14.47315a20.36356,20.36356,0,0,1,18.05452,9.065Q99.35781,32.60314,99.35784,50.0683ZM65.53555,48.22374q.031,1.84482-.00064,3.68908A53.62781,53.62781,0,0,0,67.79661,68.27a7.59492,7.59492,0,0,0,7.388,5.50319,7.68128,7.68128,0,0,0,7.36531-5.575,52.20713,52.20713,0,0,0,2.32864-16.29113q-.03-1.83909.002-3.67757a52.098,52.098,0,0,0-2.35326-16.40826,7.64768,7.64768,0,0,0-14.7079,0A53.58306,53.58306,0,0,0,65.53555,48.22374Z\" transform=\"translate(-0.64216 -14.42308)\"/></svg>",
    "10-days-of-statistics-94ff22d1c9.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 98.71567 71.37783\"><defs><style>.a{fill:#39424e;}</style></defs><title>10</title><path class=\"a\" d=\"M36.04,85.8009H20.9521V44.49741l.14842-6.7843.24217-7.42095q-3.7555,3.75552-5.222,4.92906L7.91861,41.81416.64216,32.72938l22.99711-18.3063h12.4008Z\" transform=\"translate(-0.64216 -14.42308)\"/><path class=\"a\" d=\"M99.35784,50.0683q0,18.08462-5.93,26.7719a20.55925,20.55925,0,0,1-18.24327,8.68725A20.34135,20.34135,0,0,1,57.168,76.55689q-6.0622-8.96868-6.06409-26.48859,0-18.26593,5.90547-26.93432A20.45387,20.45387,0,0,1,75.1846,14.47315a20.36356,20.36356,0,0,1,18.05452,9.065Q99.35781,32.60314,99.35784,50.0683ZM65.53555,48.22374q.031,1.84482-.00064,3.68908A53.62781,53.62781,0,0,0,67.79661,68.27a7.59492,7.59492,0,0,0,7.388,5.50319,7.68128,7.68128,0,0,0,7.36531-5.575,52.20713,52.20713,0,0,0,2.32864-16.29113q-.03-1.83909.002-3.67757a52.098,52.098,0,0,0-2.35326-16.40826,7.64768,7.64768,0,0,0-14.7079,0A53.58306,53.58306,0,0,0,65.53555,48.22374Z\" transform=\"translate(-0.64216 -14.42308)\"/></svg>",
    "30-days-of-code-a772ae4c2f.svg": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 98.69043 67.15833\"><defs><style>.cls-1{fill:#39424e;}</style></defs><title>30</title><g id=\"_30\" data-name=\"30\"><path class=\"cls-1\" d=\"M43.92662,32.17408A15.35642,15.35642,0,0,1,40.222,42.57246a19.19929,19.19929,0,0,1-10.39657,5.8894V48.73q7.89933.98368,11.96,4.797,4.05972,3.81516,4.05972,10.28607,0,9.41833-6.82779,14.65918-6.826,5.24448-19.49968,5.24267A47.33678,47.33678,0,0,1,.68457,80.1896V68.45429a42.43611,42.43611,0,0,0,8.34588,3.12314,35.06268,35.06268,0,0,0,9.01435,1.2065q6.826,0,10.085-2.32243,3.25538-2.32061,3.25719-7.45278a6.73442,6.73442,0,0,0-3.74813-6.51439q-3.74994-1.91573-11.96-1.91845H10.72607V44h5.04158q7.58683,0,11.0904-1.98548,3.50266-1.98638,3.50175-6.806,0-7.40477-9.28065-7.40749a21.19163,21.19163,0,0,0-6.53794,1.07245,31.87878,31.87878,0,0,0-7.38575,3.70284L.77515,23.071Q9.69892,16.64444,22.061,16.64534q10.12755,0,15.99793,4.105A13.16912,13.16912,0,0,1,43.92662,32.17408Z\" transform=\"translate(-0.68457 -16.55658)\"/><path class=\"cls-1\" d=\"M99.375,50.20277q0,17.0894-5.60136,25.30213-5.59774,8.21182-17.2461,8.21-11.2933,0-17.02146-8.47812-5.739-8.47812-5.73541-25.034,0-17.26874,5.576-25.45792,5.576-8.18737,17.18088-8.18827,11.2933,0,17.07219,8.56689Q99.37138,33.69126,99.375,50.20277Zm-31.90528,0q0,12.00524,2.07243,17.20443,2.07605,5.19557,6.98539,5.19919,4.826,0,6.96366-5.268,2.14127-5.26622,2.13765-17.13559,0-12.00252-2.15939-17.24791-2.163-5.24176-6.94192-5.24267-4.85862,0-6.96366,5.24267Q67.4661,38.19934,67.46972,50.20277Z\" transform=\"translate(-0.68457 -16.55658)\"/></g></svg>",
    "c-d1985901e6.svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 49.4 55.6\"><path d=\"M47.4 48.4c-5.3 4.6-12 7.2-19 7.2C12.8 55.6 0 43.1 0 27.8S12.8 0 28.4 0c7 0 13.7 2.5 18.9 7.1 2.2 1.9 2.4 5.2.5 7.3s-5.2 2.4-7.3.5c-3.3-2.9-7.6-4.5-12.1-4.5-9.9 0-18 7.8-18 17.4 0 9.6 8.1 17.4 18 17.4 4.5 0 8.8-1.6 12.2-4.6 2.2-1.9 5.4-1.7 7.3.5 1.9 2.2 1.7 5.5-.5 7.3z\" fill=\"#39424e\"/></svg>\r\n",
    "cpp-739b350881.svg": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 98.75 55.61658\"><defs><style>.cls-1{fill:#39424e;}</style></defs><title>C++</title><g id=\"c_\" data-name=\"c++\"><path class=\"cls-1\" d=\"M48.06011,70.63542a28.88006,28.88006,0,0,1-19.01352,7.17286C13.375,77.80829.625,65.31921.625,49.96766c0-15.31586,12.75-27.77595,28.42159-27.77595A28.74016,28.74016,0,0,1,47.996,29.3038a5.198,5.198,0,1,1-6.85059,7.81962,18.35021,18.35021,0,0,0-12.0988-4.53566c-9.93941,0-18.02554,7.7962-18.02554,17.3799,0,9.61827,8.08612,17.44346,18.02554,17.44346a18.48653,18.48653,0,0,0,12.16682-4.60034,5.19861,5.19861,0,0,1,6.84669,7.82464Z\" transform=\"translate(-0.625 -22.19171)\"/><path class=\"cls-1\" d=\"M71.22979,53.96176H65.573v5.657a2.80715,2.80715,0,0,1-5.6143,0v-5.657H54.30231a2.80685,2.80685,0,1,1,0-5.61369h5.65644V42.69133a2.80715,2.80715,0,0,1,5.6143,0v5.65674h5.65674a2.80685,2.80685,0,1,1,0,5.61369Z\" transform=\"translate(-0.625 -22.19171)\"/><path class=\"cls-1\" d=\"M96.56785,53.96176H90.91111v5.657a2.80715,2.80715,0,0,1-5.6143,0v-5.657H79.64037a2.80685,2.80685,0,1,1,0-5.61369h5.65644V42.69133a2.80715,2.80715,0,0,1,5.6143,0v5.65674h5.65674a2.80685,2.80685,0,1,1,0,5.61369Z\" transform=\"translate(-0.625 -22.19171)\"/></g></svg>\r\n",
    "java-9d05b1f559.svg": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 73.23582 98.75\"><defs><style>.cls-1{fill:#39424e;}</style></defs><title>Java</title><g id=\"java\"><path class=\"cls-1\" d=\"M49.5111,18.92259c-4.563,3.20919-9.73441,6.84655-12.50539,12.86432-4.81291,10.499,9.8484,21.95107,10.475,22.43344a.80945.80945,0,0,0,1.212-1.01451c-.053-.10222-5.31573-10.3244-5.12015-17.65776.06924-2.55419,3.64372-5.4517,7.42786-8.51932,3.4659-2.80975,7.39469-5.99425,9.69333-9.71956,5.04629-8.20012-.56241-16.2633-.6197-16.34392a.8094.8094,0,0,0-1.45116.6384A17.22453,17.22453,0,0,1,56.69,12.4828C55.43977,14.7529,52.69251,16.68508,49.5111,18.92259Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M68.73516,22.53854a.80936.80936,0,0,0-.77438-1.40314c-.77515.29471-18.98162,7.31272-18.98162,15.7923,0,5.84535,2.49691,8.93322,4.32013,11.18827a8.51541,8.51541,0,0,1,1.536,2.30037c.57283,1.87915-.78422,5.27561-1.35492,6.42589A.80942.80942,0,0,0,54.66751,57.867c.313-.21756,7.65063-5.40541,6.33466-11.65579a15.41576,15.41576,0,0,0-2.68786-5.64341c-1.59581-2.37328-2.74842-4.08752-.99984-7.2537C59.36316,29.621,68.64123,22.60874,68.73516,22.53854Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M21.343,58.14625a2.87287,2.87287,0,0,0,.42567,2.68149c1.97365,2.74012,8.96466,4.24876,19.686,4.24876H41.456c1.45271,0,2.98642-.02855,4.55736-.08486,17.14144-.61352,23.49925-5.95374,23.76155-6.18075a.80908.80908,0,0,0-.74275-1.39234C62.99511,59.06682,51.72236,59.652,43.90336,59.652c-8.74922,0-13.20493-.6303-14.29582-1.0957.55971-.76859,4.01211-2.14107,8.29019-2.98256a.80937.80937,0,0,0-.15623-1.60353C35.2338,53.9702,22.65762,54.17155,21.343,58.14625Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M78.70179,52.64594a16.91173,16.91173,0,0,0-7.02939,1.84713.80961.80961,0,0,0,.3813,1.5233c.075,0,7.54165.06114,8.21786,4.32726.59906,3.68037-7.06468,9.64357-10.06827,11.63091a.80938.80938,0,0,0,.61527,1.46659c.71286-.15256,17.43673-3.83794,15.66848-13.57506C85.40831,53.89865,81.65773,52.64594,78.70179,52.64594Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M67.23269,70.783a.8102.8102,0,0,0-.33116-.81141l-4.01-2.80878a.812.812,0,0,0-.67215-.1192A78.86966,78.86966,0,0,1,51.896,68.83267a71.65008,71.65008,0,0,1-7.8271.4141c-6.08663,0-10.06634-.71517-10.64592-1.23978-.07676-.14736-.05246-.21428-.03877-.2515a2.04153,2.04153,0,0,1,1.0334-.77843.80949.80949,0,0,0-.4708-1.54606c-4.02252.97072-5.98943,2.32815-5.84631,4.03448.2542,3.02538,7.26161,4.57819,13.18565,4.98861.85191.05825,1.77326.08775,2.73781.08775h.00154c9.85071,0,22.47915-3.09076,22.60529-3.1222A.80715.80715,0,0,0,67.23269,70.783Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M37.00108,77.27581a.80937.80937,0,0,0-.46366-1.487c-.53907.01427-5.27484.228-5.60639,3.24313a3.13539,3.13539,0,0,0,.76744,2.44677c1.70035,2.01512,6.29031,3.21285,14.02965,3.66147.91556.055,1.84559.08255,2.76462.08255a42.18314,42.18314,0,0,0,16.74354-3.21189.80968.80968,0,0,0,.076-1.42281l-5.06769-3.09366a.81477.81477,0,0,0-.58691-.10164c-.032.00675-3.24969.67408-8.10561,1.33332a26.12612,26.12612,0,0,1-3.41961.18843c-4.85071,0-10.2461-.79251-11.28085-1.31152A.32454.32454,0,0,1,37.00108,77.27581Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M43.907,94.52448c22.53778-.01909,34.6341-4.02715,36.96437-6.54933a2.79048,2.79048,0,0,0,.844-2.2888A3.53465,3.53465,0,0,0,80.1651,83.407a.81721.81721,0,0,0-1.05617.14369.8.8,0,0,0-.00521,1.05327c.14215.18284.22431.48893-.19133.90495-.93157.87-10.32729,3.511-25.97128,4.3045-2.143.11129-4.39072.168-6.68029.16837-14.00689,0-24.25781-1.91868-25.60347-3.03656C21.176,86.2,24.802,85.00936,28.658,84.33586a.8096.8096,0,0,0-.24745-1.59987c-.10878.01485-.47793.03684-.90534.06307-6.36244.38844-13.71489,1.25424-14.09851,4.53248a3.33615,3.33615,0,0,0,.88258,2.695c1.71829,1.93064,6.65715,4.49757,29.61693,4.49757Z\" transform=\"translate(-13.38209 -0.625)\"/><path class=\"cls-1\" d=\"M85.29818,88.68588a.80853.80853,0,0,0-.93273.18361c-.033.03568-3.42154,3.57892-13.60977,5.65962-3.90044.78152-11.22184,1.17786-21.7609,1.17786-10.55874,0-20.606-.41544-20.70609-.41969a.80949.80949,0,0,0-.22161,1.5962A120.51319,120.51319,0,0,0,53.09774,99.375a116.67238,116.67238,0,0,0,19.97144-1.66737c11.83478-2.07471,12.66335-7.943,12.69286-8.19182A.80953.80953,0,0,0,85.29818,88.68588Z\" transform=\"translate(-13.38209 -0.625)\"/></g></svg>\r\n",
    "problem-solving-ecaf59a612.svg": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 95.41041 98.75\"><defs><style>.cls-0{fill:none;}.cls-1{fill:#39424e;}</style></defs><title>Problem_Solving</title><g id=\"problem_solving\" data-name=\"problem solving\"><polygon class=\"cls-0\" points=\"48.433 61.241 62.272 53.23 48.433 45.582 48.433 61.241\"/><path class=\"cls-0\" d=\"M49.63581,36.26994V19.9878c0-.074.01534-.13269.01845-.20382L47.70143,18.6322,35.79772,11.86884V28.36347l5.536,3.26487Z\" transform=\"translate(-2.2948 -0.625)\"/><polygon class=\"cls-0\" points=\"48.171 18.27 48.203 18.289 62.849 9.736 48.381 1.343 33.694 9.854 48.171 18.27\"/><polygon class=\"cls-0\" points=\"1.457 70.71 46.977 96.929 46.977 80.542 1.457 54.322 1.457 70.71\"/><path class=\"cls-0\" d=\"M50.36418,79.7104c.06824,0,.07446.06223.11958.08535l45.03633-25.941L60.22771,33.15065,50.804,38.24612l-.01623.00867-.05957.03223H50.682a1.19688,1.19688,0,0,1-1.11156-.17381l-1.96128-1.18579-7.191-4.1635L4.33476,53.30579ZM34.11227,53.048l15.34529-8.92178h.00022l.178-.10358h.11113a.75833.75833,0,0,1,.52388,0h.09335l.22138.12869h0l15.1917,8.83243c.36407.2056.61034.32518.61012.87129,0,.3643.02267.41631-.36407.72837L50.81716,63.22311l-.25027.1547c-.06424.0509-.14581.03334-.218.06223-.01778.01022-.03756.00689-.056.01578a.74976.74976,0,0,1-.409.04845c-.05734-.00356-.10735.03578-.16492.01956a.82079.82079,0,0,1-.28583-.146l-.24338-.1507L34.19473,54.707c-.48565-.27894-.58212-.48788-.58212-.85195A.81609.81609,0,0,1,34.11227,53.048Z\" transform=\"translate(-2.2948 -0.625)\"/><path class=\"cls-1\" d=\"M34.19473,54.707l14.995,8.52015.24338.1507a.82079.82079,0,0,0,.28583.146c.05757.01623.10758-.02312.16492-.01956a.74976.74976,0,0,0,.409-.04845c.01845-.00889.03823-.00556.056-.01578.07224-.02889.15381-.01134.218-.06223l.25027-.1547,15.20615-8.63973c.38674-.31206.36407-.36407.36407-.72837.00022-.54611-.246-.66569-.61012-.87129L50.58556,44.1513h0l-.22138-.12869h-.09335a.75833.75833,0,0,0-.52388,0h-.11113l-.178.10358h-.00022L34.11227,53.048a.81609.81609,0,0,0-.49966.80705C33.61261,54.21909,33.70908,54.428,34.19473,54.707Zm16.53353,7.15943V46.20748l13.8381,7.64731Z\" transform=\"translate(-2.2948 -0.625)\"/><path class=\"cls-1\" d=\"M97.7052,53.85479c0-.36407.00489-.605-.3643-.72815L62.18855,32.09044l4.19862-2.27023c.42142-.18737.3643-.36407.3643-.72837V10.88376c0-.07668-.01578-.13758-.01911-.21071a1.21385,1.21385,0,0,0,.01911-.15336c0-.3643,0-.72837-.3643-.72837L51.21191.7584a.94806.94806,0,0,0-.96153-.00489L34.70527,9.79132a.68617.68617,0,0,0-.29495.337.60869.60869,0,0,0-.03067.08246,2.3798,2.3798,0,0,0-.03867.673V28.79689a.65773.65773,0,0,0,.3643.65924l3.981,2.30513L2.65887,52.39828c-.36407.36407-.36407.36407-.36407.72837,0,.07668.01578.13758.01911.21071a1.21385,1.21385,0,0,0-.01911.15336v17.844c0,.36407,0,.52988.36407.72815L49.99989,99.375a1.71436,1.71436,0,0,0,.65813-.33407l.07024-.03L97.3409,72.42717c.3643,0,.3643-.36407.3643-.72837V54.21909l-.01378-.01378A2.62317,2.62317,0,0,0,97.7052,53.85479ZM50.67536,1.968,65.144,10.36121l-14.64626,8.5526-.03245-.01889L35.98864,10.47857ZM35.79772,11.86884,47.70143,18.6322,49.65426,19.784c-.00311.07113-.01845.1298-.01845.20382V36.26994l-8.3021-4.64159-5.536-3.26487ZM47.60919,36.92741l1.96128,1.18579A1.19688,1.19688,0,0,0,50.682,38.287h.04623l.05957-.03223.01623-.00867,9.42366-5.09546L95.5201,53.85479l-45.03633,25.941c-.04512-.02312-.05134-.08535-.11958-.08535L4.33476,53.30579,40.41819,32.76391Zm1.66255,60.62678L3.75153,71.33473V54.94745L49.27174,81.16692Z\" transform=\"translate(-2.2948 -0.625)\"/></g></svg>",
    "python-f70befd824.svg": "<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 98.26787 98.75\"><defs><style>.cls-1{fill:#39424e;}</style></defs><title>Python</title><g id=\"python\"><path class=\"cls-1\" d=\"M26.31275,23.00614c0-4.2737-.1887-8.241.05344-12.18186A8.05611,8.05611,0,0,1,32.585,3.16151,69.793,69.793,0,0,1,44.40155.916a58.78917,58.78917,0,0,1,18.04582.96134C69.51064,3.41018,73.37394,8.28153,73.379,15.45744q.0069,9.85116-.00149,19.70232c-.01457,8.39636-4.82013,13.22307-13.15621,13.22778-7.15266.004-14.30535-.01385-21.458.00485-9.10975.02381-15.54653,6.49492-15.577,15.63731-.01059,3.17492-.00169,6.34991-.00169,9.94764-3.82582-.17841-7.54676.00151-11.13318-.6089-4.45312-.75794-6.984-4.13279-8.415-8.1603A42.8762,42.8762,0,0,1,1.42961,43.344c.29533-1.727.63845-3.44938,1.04766-5.15273,1.89359-7.88219,7.2632-12.19521,15.36543-12.23785,9.75336-.05133,19.50719-.013,29.26081-.01355.77224,0,1.54447,0,2.47235,0V23.00614Zm10.217-6.1229a4.376,4.376,0,0,0,4.34586-4.51379,4.3979,4.3979,0,1,0-8.793.11663A4.36,4.36,0,0,0,36.52971,16.88324Z\" transform=\"translate(-0.86607 -0.625)\"/><path class=\"cls-1\" d=\"M73.68725,76.99386c0,4.2737.1887,8.241-.05344,12.18186a8.05611,8.05611,0,0,1-6.2188,7.66276A69.793,69.793,0,0,1,55.59845,99.084a58.78917,58.78917,0,0,1-18.04582-.96134c-7.06328-1.53287-10.92657-6.40423-10.9316-13.58013q-.0069-9.85116.00149-19.70232c.01457-8.39636,4.82013-13.22307,13.15621-13.22778,7.15266-.004,14.30535.01385,21.458-.00485,9.10975-.02381,15.54653-6.49492,15.577-15.63731.01059-3.17492.00169-6.34991.00169-9.94764,3.82582.17841,7.54676-.00151,11.13318.6089,4.45312.75794,6.984,4.13279,8.415,8.1603A42.8762,42.8762,0,0,1,98.57039,56.656c-.29533,1.727-.63845,3.44938-1.04766,5.15273-1.89359,7.88219-7.2632,12.19521-15.36543,12.23785-9.75336.05133-19.50719.013-29.26081.01355-.77224,0-1.54447,0-2.47235,0v2.93374Zm-10.217,6.1229a4.376,4.376,0,0,0-4.34586,4.51379,4.3979,4.3979,0,1,0,8.793-.11663A4.36,4.36,0,0,0,63.47029,83.11676Z\" transform=\"translate(-0.86607 -0.625)\"/></g></svg>\r\n",
    "ruby-b2c8eababe.svg": "<svg id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 56.4 55.6\"><style>.st0{fill:#39424e}</style><path class=\"st0\" d=\"M6 35.6c-.5-1.1-.9-2.2-1.4-3.2-.9-2.2-1.8-4.3-2.7-6.5 0-.1-.1-.2 0-.3l6-10.2c.1-.2.2-.3.3-.4 3.6-3.4 7.2-6.7 10.8-10.1.2-.1.4-.3.6-.3 3.1-1.1 6.1-2.2 9.2-3.4h.3c2.6 1.8 5.1 3.6 7.7 5.4.1.1.1.1.1.2L33 19.1c0 .1-.1.2-.1.2-4.9 4.5-9.7 9-14.6 13.5-.1.1-.2.1-.2.1-3.9.9-7.9 1.8-11.8 2.7H6zM19.6 35.6c6.3 2.4 12.5 4.8 18.7 7.2l-.1.1c-2.7 2.5-5.6 4.7-8.7 6.7-3.8 2.3-7.8 4.1-12.1 5.1-.9.2-1.7.3-2.6.5h-.1c1.6-6.5 3.3-13 4.9-19.6zM35.6 21c6.2-.1 12.3-.3 18.5-.4 0 .1-.1.1-.1.2-1.1 3.1-2.6 6-4.4 8.8-1.5 2.4-3.2 4.6-5.1 6.8-.9 1.1-1.8 2.1-2.7 3.1 0 0 0 .1-.1.1-2.1-6.2-4.1-12.4-6.1-18.6zM21 33.5c4.1-3.9 8.3-7.7 12.4-11.5 2 6.2 4.1 12.4 6.1 18.7-6.2-2.4-12.4-4.8-18.5-7.2zM42.7 42c.4-.4.8-.8 1.1-1.3 2.5-2.7 4.8-5.6 6.9-8.6 1.5-2.2 2.9-4.6 4-7 0-.1.1-.1.1-.2-.7 8.8-1.3 17.6-2 26.4 0-.1 0-.1-.1-.1-.1-.2-.2-.4-.4-.5-3.2-2.8-6.4-5.7-9.6-8.5.1-.1.1-.1 0-.2zM55.1 17c-4.9-3.6-9.9-7.2-14.8-10.7.1 0 .1-.1.2-.1l8.7-4.8h.2c1.2.5 2.4 1.2 3.3 2.1 1.1 1 1.8 2.2 2.3 3.6.5 1.5.8 3 .8 4.6 0 1.3-.2 2.6-.4 3.9 0 .4-.2.9-.3 1.4zM41 43.7c.1 0 .1.1.2.1 3.2 2.9 6.4 5.7 9.7 8.6.2.2.5.4.8.5-8.8.6-17.5 1.2-26.3 1.8h.1c4-1.8 7.6-4.1 11-6.9 1.5-1.2 3-2.6 4.5-3.9-.1-.1-.1-.2 0-.2zM52.7 18.3c-5.7.1-11.4.3-17.1.4l3.3-10.5c4.6 3.3 9.2 6.7 13.8 10.1 0-.1 0-.1 0 0zM17.1 35.6c-1.5 6.1-3.1 12.2-4.6 18.3-1.9-5.3-3.7-10.7-5.6-16 3.4-.8 6.8-1.5 10.2-2.3zM10.4 55.4c-.8-.1-1.6-.2-2.4-.5-1.6-.5-3.1-1.2-4.3-2.4-1.2-1.2-2-2.6-2.5-4.2l-.3-1.2v-.2c1.3-2.3 2.7-4.6 4-6.9.1 0 .1 0 .1-.1 1.8 5.2 3.6 10.3 5.4 15.5zM31.9.2h14.3c-.1.1-.2.1-.2.2-2.5 1.4-5.1 2.8-7.6 4.2-.1.1-.2.1-.3 0-2-1.4-4-2.8-6.1-4.2 0-.1 0-.1-.1-.2zM.5 28.8c.3.6.5 1.2.8 1.9.9 2.1 1.7 4.1 2.6 6.2 0 .1.1.2 0 .3L.6 42.9s0 .1-.1.1V28.8z\"/></svg>",
    "sql-89e76e7082.svg": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<!-- Generator: Adobe Illustrator 21.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\r\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 98.3 98.8\" style=\"enable-background:new 0 0 98.3 98.8;\" xml:space=\"preserve\">\r\n<style type=\"text/css\">\r\n\t.st0{fill:none;stroke:#39424E;stroke-width:8;stroke-miterlimit:10;}\r\n\t.st1{fill:none;stroke:#39424E;stroke-width:8;stroke-linecap:round;stroke-miterlimit:10;}\r\n</style>\r\n<title>Artboard 8</title>\r\n<g>\r\n\t<ellipse class=\"st0\" cx=\"48.5\" cy=\"22.8\" rx=\"43.3\" ry=\"15\"/>\r\n\t<path class=\"st1\" d=\"M6.3,44.7c0,0,35.9,21.1,86.5,0\"/>\r\n\t<path class=\"st1\" d=\"M6.3,60.7c0,0,35.9,21.1,86.5,0\"/>\r\n\t<path class=\"st1\" d=\"M6.3,78.9c0,0,35.9,21.1,86.5,0\"/>\r\n</g>\r\n</svg>\r\n"
}    

app.get('/', (req, res) => {
    res.redirect('api/index.html')
})

app.get('/:username', (req, res) => {
    const username = req.params.username

    const options = {
        hostname: "www.hackerrank.com",
        path: `/profile/${username}`,
        method: 'GET',
        headers: { 'user-agent': 'node-js' }
    }    

    const proxyRequest = https.request(options, (proxyResponse) => {
        const chunks = []
        proxyResponse.on("data", (chunk) => { chunks.push(chunk) })
        proxyResponse.on("end", () => {
            const buffer = Buffer.concat(chunks)
            const data = buffer.toString('utf8')
            //console.log(data)
            const $ = cheerio.load(data)
            console.log($('.profile-title-wrapper :first').text())
            const badges = $('.hacker-badges-v2 .hacker-badge');
            const numBadges = badges.length
            const width = 500, height = (numBadges < 5) ? 160 : 270

            // Initialize SVG header
            let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}px" height="${height}px" style="outline:solid black 1.5px; outline-offset: -1.5px">`;
            svgContent += `<text x="10" y="23" font-size="24" font-weight="bold" font-family="Satoshi, Open Sans, sans-serif">${$('.profile-title-wrapper :first').text()}</text>`
            svgContent += `<text x="10" y="40" font-size="14" font-family="Satoshi, Open Sans, sans-serif">@${username}</text>`
            svgContent += `<g transform="translate(410,5)">${$('.hacker-badges .section-card-header :first').html()}`
            svgContent += `<text x="27" y="17" font-size="16" font-weight="bold" font-family="Satoshi, Open Sans, sans-serif">Badges</text></g>`;

            // Loop through the badges and extract SVGs
            badges.each((index, element) => {
                const name = $(element)._findBySelector('image.badge-icon').attr().href.split('/').reverse()[0]
                console.log(name)
                const data = `<svg x="32" y="22" height="27" width="27">${icons[name]}</svg>`
                $(element)._findBySelector('image.badge-icon').replaceWith(data)
                const badgeSvg = $(element).find('svg').html() // Extract the inner SVG content
                svgContent += `<svg width="91" height="100" x="${(index % 5) * 95 + 10}" y="${Math.floor(index / 5) * 110 + 55}" style="text-anchor:middle">${badgeSvg}</svg>`; // Position badges vertically

            });    

            svgContent += '</svg>';

            // Set the response content type to text/xml for SVG
            res.set('Content-Type', 'image/svg+xml');
            res.send(svgContent);
        })    
    })    

    proxyRequest.on("error", (err) => {
        console.error(err)
        res.status(500).send('Error fetching data:' + err)
    })    

    proxyRequest.end()
})    


const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})