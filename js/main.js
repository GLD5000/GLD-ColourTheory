import { variantMaker } from './modules/controllers/variantmaker.js';
import { paletteUi} from './modules/controllers/paletteui.js';
import { gradientMaker } from './modules/controllers/gradientmaker.js';
import { paletteData } from './modules/controllers/palettedata.js';
//console.log(paletteData);
paletteUi._init();
console.log(paletteUi.userObjects());
console.log(paletteData);