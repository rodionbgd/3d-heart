import BaseHeart from "./BaseHeart";
import Room from "./Room";

const advancedHeart = new BaseHeart();
advancedHeart.init();
advancedHeart.addRoom(new Room({ width: 80, height: 80, depth: 80 }));

const baseHeart = new BaseHeart();
baseHeart.init();
