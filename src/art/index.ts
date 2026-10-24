// Item art lookup: chain + level → inner SVG markup.
import { ChainId, CHAINS, Item } from '../game/items';
import { BREAD, GEN_BREAD, GEN_TEA, TEA } from './chainsA';
import { GARDEN, GEN_GARDEN, GEN_POTTERY, GEN_TEXTILE, GEN_TOOLS, POTTERY, TEXTILE, TOOLS } from './chainsB';
import { CHEST, COINS, ENERGY } from './chainsC';
import { GEN_SWEETS, SWEETS } from './chainsD';
import { GEN_POST, POST } from './chainsE';
import { ASH, GEN_ASH, GEN_ICECREAM, GEN_KITE, GEN_LAVASHAK, GEN_NOWRUZ, GEN_YALDA, ICECREAM, KITE, LAVASHAK, NOWRUZ, YALDA } from './events';

const ART: Record<ChainId, string[]> = {
  tea: TEA,
  bread: BREAD,
  garden: GARDEN,
  tools: TOOLS,
  textile: TEXTILE,
  pottery: POTTERY,
  sweets: SWEETS,
  post: POST,
  genTea: GEN_TEA,
  genBread: GEN_BREAD,
  genGarden: GEN_GARDEN,
  genTools: GEN_TOOLS,
  genTextile: GEN_TEXTILE,
  genPottery: GEN_POTTERY,
  genSweets: GEN_SWEETS,
  genPost: GEN_POST,
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
