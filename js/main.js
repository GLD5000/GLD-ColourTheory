import { userObjects } from './modules/view/userobjects.js';
import { variantMaker } from './modules/controllers/variantmaker.js';
import { gradientMaker } from './modules/controllers/gradientmaker.js';
import { paletteData } from './modules/controllers/palettedata.js';
import { paletteUi} from './modules/controllers/paletteui.js';
//console.log(paletteData);
console.log(paletteUi.userObjects());
console.log(paletteData);
paletteUi._init();