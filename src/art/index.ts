// Item art lookup: chain + level → inner SVG markup.
import { ChainId, CHAINS, Item } from '../game/items';
import { BREAD, GEN_BREAD, GEN_TEA, TEA } from './chainsA';
import { GARDEN, GEN_GARDEN, GEN_POTTERY, GEN_TEXTILE, GEN_TOOLS, POTTERY, TEXTILE, TOOLS } from './chainsB';
import { CHEST, COINS, ENERGY } from './chainsC';

const ART: Record<ChainId, string[]> = {
  tea: TEA,
  bread: BREAD,
  garden: GARDEN,
  tools: TOOLS,
  textile: TEXTILE,
  pottery: POTTERY,
  genTea: GEN_TEA,
  genBread: GEN_BREAD,
  genGarden: GEN_GARDEN,
  genTools: GEN_TOOLS,
  genTextile: GEN_TEXTILE,
  genPottery: GEN_POTTERY,
  chest: CHEST,
  coins: COINS,
  energy: ENERGY,
};

export function itemArt(it: Item): string {
  return ART[it.chain][it.level - 1] ?? '';
}

export const ART_ROWS = (Object.keys(ART) as ChainId[]).map((id) => ({
  title: CHAINS[id].name,
  items: ART[id],
  names: CHAINS[id].levels,
}));
