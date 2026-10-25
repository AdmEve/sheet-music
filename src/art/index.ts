// Item art lookup: chain + level → inner SVG markup.
import { ChainId, CHAINS, Item } from '../game/items';
import { BREAD, GEN_BREAD, GEN_TEA, TEA } from './chainsA';
import { GARDEN, GEN_GARDEN, GEN_POTTERY, GEN_TEXTILE, GEN_TOOLS, POTTERY, TEXTILE, TOOLS } from './chainsB';
import { CHEST, COINS, ENERGY } from './chainsC';
import { GEN_SWEETS, SWEETS } from './chainsD';
import { GEN_POST, POST } from './chainsE';
import { BABY, GEN_BABY } from './chainsF';
import { GEN_LAMP, LAMP } from './chainsG';
import { GEN_SAZ, SAZ } from './chainsH';
import { GEN_TILE, TILE } from './chainsI';
import { FOOTBALL, GEN_FOOTBALL } from './chainsJ';
import { GEN_SEA, SEA } from './chainsK';
import { CRAFT, GEN_CRAFT } from './chainsL';
import { CALLIGRAPHY, GEN_CALLIGRAPHY } from './chainsM';
import { GEN_PARTY, PARTY } from './chainsN';
import { GEN_WEDDING, WEDDING } from './chainsO';
import { DESERT, GEN_DESERT } from './chainsP';
import { GEN_YAZD, YAZD } from './chainsQ';
import { CLASS, GEN_CLASS } from './chainsR';
import { GEN_KITCHEN, KITCHEN } from './chainsS';
import { GEN_WINTER, WINTER } from './chainsT';
import {
  ASH, GEN_ASH, GEN_ICECREAM, GEN_KITE, GEN_LAVASHAK, GEN_NOWRUZ, GEN_SCHOOL, GEN_SURI, GEN_YALDA, ICECREAM, KITE, LAVASHAK, NOWRUZ, SCHOOL, SURI, YALDA,
} from './events';

const ART: Record<ChainId, string[]> = {
  tea: TEA,
  bread: BREAD,
  garden: GARDEN,
  tools: TOOLS,
  textile: TEXTILE,
  pottery: POTTERY,
  sweets: SWEETS,
  post: POST,
  baby: BABY,
  lamp: LAMP,
  saz: SAZ,
  tile: TILE,
  football: FOOTBALL,
  sea: SEA,
  craft: CRAFT,
  callig: CALLIGRAPHY,
  party: PARTY,
  wed: WEDDING,
  desert: DESERT,
  yazd: YAZD,
  night: CLASS,
  kitchen: KITCHEN,
  winter: WINTER,
  genTea: GEN_TEA,
  genBread: GEN_BREAD,
  genGarden: GEN_GARDEN,
  genTools: GEN_TOOLS,
  genTextile: GEN_TEXTILE,
  genPottery: GEN_POTTERY,
  genSweets: GEN_SWEETS,
  genPost: GEN_POST,
  genBaby: GEN_BABY,
  genLamp: GEN_LAMP,
  genSaz: GEN_SAZ,
  genTile: GEN_TILE,
  genFootball: GEN_FOOTBALL,
  genSea: GEN_SEA,
  genCraft: GEN_CRAFT,
  genCallig: GEN_CALLIGRAPHY,
  genParty: GEN_PARTY,
  genWed: GEN_WEDDING,
  genDesert: GEN_DESERT,
  genYazd: GEN_YAZD,
  genNight: GEN_CLASS,
  genKitchen: GEN_KITCHEN,
  genWinter: GEN_WINTER,
  chest: CHEST,
  coins: COINS,
  energy: ENERGY,
  yalda: YALDA,
  genYalda: GEN_YALDA,
  nowruz: NOWRUZ,
  genNowruz: GEN_NOWRUZ,
  kite: KITE,
  genKite: GEN_KITE,
  lavashak: LAVASHAK,
  genLavashak: GEN_LAVASHAK,
  ash: ASH,
  genAsh: GEN_ASH,
  icecream: ICECREAM,
  genIcecream: GEN_ICECREAM,
  suri: SURI,
  genSuri: GEN_SURI,
  school: SCHOOL,
  genSchool: GEN_SCHOOL,
};

export function itemArt(it: Item): string {
  return ART[it.chain][it.level - 1] ?? '';
}

export const ART_ROWS = (Object.keys(ART) as ChainId[]).map((id) => ({
  id,
  title: CHAINS[id].name,
  items: ART[id],
  names: CHAINS[id].levels,
}));
