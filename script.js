/* ============================================================================
   script.js — "La Palabra" Spanish Word Guessing Game
   ----------------------------------------------------------------------------
   HOW THE GAME WORKS (overview):
   1. The player picks a word length (5, 6, 7, 8+ or 13 letters).
   2. A random Spanish word of that length is chosen; its letters are hidden
      behind blank tiles.
   3. The player guesses letters (by clicking the on-screen keyboard or typing
      on a physical keyboard). Correct letters are revealed on the tiles;
      wrong guesses cost one "try".
   4. The player wins by revealing the whole word before running out of tries.
      Winning extends the score streak; losing resets it to 0.
   ========================================================================== */

/* ---------- Word data: frequent Spanish nouns (with accents) ---------- */
// WORDS is a lookup table keyed by word length. Each key (5, 6, 7, 8, 13)
// holds an array of word entries used by the game:
//   w = the Spanish word (uppercase, shown on the tiles)
//   m = the English meaning/translation revealed after the round ends
// NOTE: All entries are uppercase. Words use Á É Í Ó Ú Ñ — all of these
// exist on the on-screen keyboard (ROWS) and in the physical-keyboard
// regex, so every word is winnable.

const WORDS = {
  5: [
    { w:'PERRO', m:'dog' }, { w:'LIBRO', m:'book' }, { w:'SILLA', m:'chair' },
    { w:'CIELO', m:'sky' }, { w:'PLAYA', m:'beach' }, { w:'CAMPO', m:'field; countryside' },
    { w:'CALLE', m:'street' }, { w:'PLAZA', m:'town square' }, { w:'FUEGO', m:'fire' },
    { w:'NIEVE', m:'snow' }, { w:'ÁRBOL', m:'tree' }, { w:'LECHE', m:'milk' },
    { w:'QUESO', m:'cheese' }, { w:'HUEVO', m:'egg' }, { w:'CARNE', m:'meat' },
    { w:'POLLO', m:'chicken' }, { w:'ARROZ', m:'rice' }, { w:'FRUTA', m:'fruit' },
    { w:'LIMÓN', m:'lemon' }, { w:'MELÓN', m:'melon' }, { w:'PLATO', m:'plate; dish' },
    { w:'RADIO', m:'radio' }, { w:'BAILE', m:'dance' }, { w:'COLOR', m:'color' },
    { w:'VERDE', m:'green' }, { w:'NEGRO', m:'black' }, { w:'OREJA', m:'ear' },
    { w:'NARIZ', m:'nose' }, { w:'BRAZO', m:'arm' }, { w:'HUESO', m:'bone' },
    { w:'PADRE', m:'father' }, { w:'MADRE', m:'mother' }, { w:'AMIGO', m:'friend' },
    { w:'MUJER', m:'woman; wife' }, { w:'SEÑOR', m:'sir; mister' }, { w:'REINA', m:'queen' },
    { w:'BANCO', m:'bank; bench' }, { w:'CLASE', m:'class; classroom' }, { w:'LÁPIZ', m:'pencil' },
    { w:'PAPEL', m:'paper' }, { w:'CARTA', m:'letter (mail)' }, { w:'MUNDO', m:'world' },
    { w:'AVIÓN', m:'airplane' }, { w:'COCHE', m:'car' }, { w:'LLAVE', m:'key' },
    { w:'OTOÑO', m:'autumn; fall' }, { w:'SUEÑO', m:'dream' }, { w:'RATÓN', m:'mouse' },
    { w:'JABÓN', m:'soap' }, { w:'ARAÑA', m:'spider' },
    { w:'TIGRE', m:'tiger' }, { w:'CEBRA', m:'zebra' }, { w:'GALLO', m:'rooster' },
    { w:'GANSO', m:'goose' }, { w:'PULPO', m:'octopus' }, { w:'ABEJA', m:'bee' },
    { w:'MOSCA', m:'fly (insect)' }, { w:'ERIZO', m:'hedgehog' }, { w:'LINCE', m:'lynx' },
    { w:'HIENA', m:'hyena' }, { w:'KOALA', m:'koala' }, { w:'LÉMUR', m:'lemur' },
    { w:'ÑANDÚ', m:'rhea' }, { w:'CORZO', m:'roe deer' }, { w:'GARZA', m:'heron' },
    { w:'CISNE', m:'swan' }, { w:'ORUGA', m:'caterpillar' }, { w:'GARRA', m:'claw' },
    { w:'PANAL', m:'honeycomb' }, { w:'PULGA', m:'flea' }, { w:'HONGO', m:'fungus' },
    { w:'TUCÁN', m:'toucan' }, { w:'SELVA', m:'jungle' }, { w:'MAREA', m:'tide' },
    { w:'BRISA', m:'breeze' }, { w:'ROCÍO', m:'dew' }, { w:'OCASO', m:'sunset' },
    { w:'BRASA', m:'ember' }, { w:'LLAMA', m:'flame' }, { w:'HOGAR', m:'hearth; home' },
    { w:'FAROL', m:'streetlamp' }, { w:'TORRE', m:'tower' }, { w:'PASEO', m:'promenade; stroll' },
    { w:'ACERA', m:'sidewalk' }, { w:'CRUCE', m:'crossing' }, { w:'METRO', m:'subway' },
    { w:'RUEDA', m:'wheel' }, { w:'MOTOR', m:'engine' }, { w:'FRENO', m:'brake' },
    { w:'ANCLA', m:'anchor' }, { w:'CANOA', m:'canoe' }, { w:'TIMÓN', m:'rudder; helm' },
    { w:'VAGÓN', m:'train car' }, { w:'ANDÉN', m:'platform' }, { w:'TIFÓN', m:'typhoon' },
    { w:'MÓVIL', m:'cell phone' }, { w:'ÁLBUM', m:'album' }, { w:'VÍDEO', m:'video' },
    { w:'LENTE', m:'lens' }, { w:'MARCO', m:'frame' },
    { w:'CABRA', m:'goat' }, { w:'OVEJA', m:'sheep' }, { w:'BURRO', m:'donkey' },
    { w:'PANDA', m:'panda' }, { w:'COBRA', m:'cobra' }, { w:'ZORRO', m:'fox' },
    { w:'TEJÓN', m:'badger' }, { w:'GAMBA', m:'shrimp' }, { w:'OSTRA', m:'oyster' },
    { w:'PECHO', m:'chest' }, { w:'MUSLO', m:'thigh' }, { w:'PALMA', m:'palm (of hand)' },
    { w:'TALÓN', m:'heel' }, { w:'RIÑÓN', m:'kidney' }, { w:'MUELA', m:'molar' },
    { w:'LABIO', m:'lip' }, { w:'BARBA', m:'beard; chin' },
    { w:'PRIMO', m:'cousin' }, { w:'NIETO', m:'grandson' }, { w:'YERNO', m:'son-in-law' },
    { w:'NUERA', m:'daughter-in-law' }, { w:'MONJE', m:'monk' }, { w:'POETA', m:'poet' },
    { w:'JOVEN', m:'young person' }, { w:'ÁNGEL', m:'angel' }, { w:'HÉROE', m:'hero' },
    { w:'NOVIO', m:'boyfriend; groom' },
    { w:'FRESA', m:'strawberry' }, { w:'MANGO', m:'mango' }, { w:'SALSA', m:'sauce' },
    { w:'PASTA', m:'pasta' }, { w:'TARTA', m:'cake' }, { w:'CREMA', m:'cream' },
    { w:'CALDO', m:'broth; soup' }, { w:'TRUFA', m:'truffle' }, { w:'CACAO', m:'cocoa' },
    { w:'MENTA', m:'mint' }, { w:'OLIVA', m:'olive' },
    { w:'RELOJ', m:'clock; watch' }, { w:'PARED', m:'wall' }, { w:'TECHO', m:'ceiling; roof' },
    { w:'SUELO', m:'floor; ground' }, { w:'DUCHA', m:'shower' }, { w:'GRIFO', m:'faucet; tap' },
    { w:'HORNO', m:'oven' }, { w:'SALÓN', m:'living room' }, { w:'PATIO', m:'courtyard; patio' },
    { w:'BOLSO', m:'handbag' }, { w:'BOTÓN', m:'button' }, { w:'PEINE', m:'comb' },
    { w:'MANTA', m:'blanket' },
    { w:'POLVO', m:'dust; powder' }, { w:'POLEN', m:'pollen' }, { w:'ROBLE', m:'oak' },
    { w:'BAMBÚ', m:'bamboo' }, { w:'MONTE', m:'hill; mountain' }, { w:'ARENA', m:'sand' },
    { w:'COSTA', m:'coast' }, { w:'CUEVA', m:'cave' }, { w:'PERLA', m:'pearl' },
    { w:'PLATA', m:'silver' },
    { w:'TARDE', m:'afternoon; evening' }, { w:'NOCHE', m:'night' }, { w:'CALOR', m:'heat' },
    { w:'HIELO', m:'ice' }, { w:'VAPOR', m:'steam' }, { w:'BRUMA', m:'mist; haze' },
    { w:'BLUSA', m:'blouse' }, { w:'FALDA', m:'skirt' }, { w:'TRAJE', m:'suit; costume' },
    { w:'GORRA', m:'cap' }, { w:'BOINA', m:'beret' },
    { w:'RITMO', m:'rhythm' }, { w:'PIANO', m:'piano' }, { w:'DANZA', m:'dance' },
    { w:'MUSEO', m:'museum' }, { w:'POEMA', m:'poem' }, { w:'PLUMA', m:'pen; feather' },
    { w:'BARCO', m:'ship; boat' }, { w:'GLOBO', m:'balloon; globe' }, { w:'CARRO', m:'cart; car (LatAm)' },
    { w:'PESCA', m:'fishing' },
    { w:'MIEDO', m:'fear' }, { w:'SUSTO', m:'fright; scare' }, { w:'RABIA', m:'rage; rabies' },
    { w:'DESEO', m:'desire; wish' }, { w:'GUSTO', m:'taste; liking' }, { w:'CALMA', m:'calm' },
    { w:'VALOR', m:'courage; value' }, { w:'DOLOR', m:'pain' },
    { w:'JUEGO', m:'game' }, { w:'BALÓN', m:'ball' }, { w:'RIVAL', m:'rival; opponent' },
    { w:'NAIPE', m:'playing card' },
    { w:'MENTE', m:'mind' }, { w:'RAZÓN', m:'reason' }, { w:'HONOR', m:'honor' },
    { w:'MAGIA', m:'magic' }, { w:'BRUJA', m:'witch' }, { w:'FIERA', m:'wild beast' },
    { w:'YEGUA', m:'mare' }, { w:'POTRO', m:'colt; foal' }, { w:'CERDO', m:'pig' },
    { w:'MAMUT', m:'mammoth' }, { w:'HURÓN', m:'ferret' }, { w:'TAPIR', m:'tapir' },
    { w:'MIRLO', m:'blackbird' },
    { w:'PANZA', m:'belly' }, { w:'TRIPA', m:'gut; belly' }, { w:'AXILA', m:'armpit' },
    { w:'PULSO', m:'pulse' }, { w:'SUDOR', m:'sweat' }, { w:'GRITO', m:'shout; scream' },
    { w:'VISTA', m:'view; sight' }, { w:'SABOR', m:'flavor; taste' }, { w:'AROMA', m:'scent; aroma' },
    { w:'RUIDO', m:'noise' },
    { w:'CHICO', m:'boy' }, { w:'CHICA', m:'girl' }, { w:'VIEJO', m:'old man' },
    { w:'VIEJA', m:'old woman' }, { w:'NOVIA', m:'girlfriend; bride' }, { w:'VIUDO', m:'widower' },
    { w:'VIUDA', m:'widow' }, { w:'AUTOR', m:'author' }, { w:'ACTOR', m:'actor' },
    { w:'LÍDER', m:'leader' }, { w:'DUEÑO', m:'owner' }, { w:'SABIO', m:'sage; wise man' },
    { w:'AVENA', m:'oats' }, { w:'JALEA', m:'jelly' }, { w:'DULCE', m:'candy; sweet' },
    { w:'CHILE', m:'chili pepper' }, { w:'CLAVO', m:'clove; nail' }, { w:'YOGUR', m:'yogurt' },
    { w:'FIDEO', m:'noodle' }, { w:'JUDÍA', m:'bean' }, { w:'GRANO', m:'grain' },
    { w:'GUISO', m:'stew' }, { w:'ASADO', m:'roast; barbecue' }, { w:'TORTA', m:'cake; pie' },
    { w:'BOLLO', m:'bun' }, { w:'PALTA', m:'avocado (LatAm)' },
    { w:'TABLA', m:'board; plank' }, { w:'CAJÓN', m:'drawer' }, { w:'COFRE', m:'chest; trunk' },
    { w:'BOLSA', m:'bag' }, { w:'CESTA', m:'basket' }, { w:'BALDE', m:'bucket' },
    { w:'JARRA', m:'jug; pitcher' }, { w:'TAZÓN', m:'bowl; mug' }, { w:'TRAPO', m:'rag; cloth' },
    { w:'FOGÓN', m:'stove; hearth' }, { w:'CINTA', m:'ribbon; tape' }, { w:'MALLA', m:'mesh; net' },
    { w:'LISTA', m:'list' }, { w:'SELLO', m:'stamp; seal' }, { w:'JAULA', m:'cage' },
    { w:'SAVIA', m:'sap' }, { w:'MUSGO', m:'moss' }, { w:'ZARZA', m:'bramble' },
    { w:'LIRIO', m:'lily' }, { w:'DALIA', m:'dahlia' }, { w:'CACTO', m:'cactus' },
    { w:'AGAVE', m:'agave' }, { w:'BROTE', m:'sprout; bud' }, { w:'PRADO', m:'meadow' },
    { w:'OASIS', m:'oasis' },
    { w:'SIGLO', m:'century' }, { w:'FECHA', m:'date' }, { w:'FERIA', m:'fair' },
    { w:'TAREA', m:'task; homework' }, { w:'PELEA', m:'fight; brawl' }, { w:'LUCHA', m:'fight; struggle' },
    { w:'GOLPE', m:'blow; hit' }, { w:'MULTA', m:'fine; ticket' }, { w:'HURTO', m:'theft' },
    { w:'PACTO', m:'pact; deal' }, { w:'CAUSA', m:'cause' }, { w:'FINAL', m:'end; finale' },
    { w:'PAUSA', m:'pause' }, { w:'ÉXITO', m:'success' }, { w:'FORMA', m:'shape; form' },
    { w:'MITAD', m:'half' }, { w:'PARTE', m:'part' }, { w:'CIFRA', m:'figure; number' },
    { w:'RUMOR', m:'rumor' }, { w:'MARCA', m:'brand; mark' },
    { w:'FÁCIL', m:'easy' }, { w:'NUEVO', m:'new' }, { w:'LARGO', m:'long' },
    { w:'CORTO', m:'short' }, { w:'GORDO', m:'fat' }, { w:'FLACO', m:'skinny' },
    { w:'SUCIO', m:'dirty' }, { w:'LENTO', m:'slow' }, { w:'VELOZ', m:'fast' },
    { w:'TIBIO', m:'lukewarm' }, { w:'POBRE', m:'poor' }, { w:'FALSO', m:'false' },
    { w:'MORSA', m:'walrus' }, { w:'PITÓN', m:'python' }, { w:'MAMBA', m:'mamba' },
    { w:'BISÓN', m:'bison' }, { w:'CHITA', m:'cheetah (LatAm)' }, { w:'TORDO', m:'thrush; starling' },
    { w:'GRAJO', m:'rook (bird)' }, { w:'PIOJO', m:'louse' }, { w:'BICHO', m:'bug; critter' },
    { w:'SEPIA', m:'cuttlefish' }, { w:'CORAL', m:'coral' }, { w:'LIRÓN', m:'dormouse' },
    { w:'VALLE', m:'valley' }, { w:'BAHÍA', m:'bay' }, { w:'GOLFO', m:'gulf' },
    { w:'DELTA', m:'delta' }, { w:'CAUCE', m:'riverbed; channel' }, { w:'FONDO', m:'bottom; depth' },
    { w:'GRUTA', m:'grotto; cave' }, { w:'CAÑÓN', m:'canyon' }, { w:'DIQUE', m:'dike; dock' },
    { w:'CANAL', m:'canal; channel' }, { w:'PRESA', m:'dam; prey' }, { w:'TRIGO', m:'wheat' },
    { w:'BREVA', m:'fig' }, { w:'DÁTIL', m:'date (fruit)' }, { w:'CERRO', m:'hill' },
    { w:'RISCO', m:'crag; cliff' }, { w:'JUNCO', m:'reed; rush' }, { w:'ABETO', m:'fir tree' },
    { w:'CEDRO', m:'cedar' }, { w:'SAUCE', m:'willow' }, { w:'CHOPO', m:'poplar' },
    { w:'NOGAL', m:'walnut tree' }, { w:'OLIVO', m:'olive tree' }, { w:'TALLO', m:'stem; stalk' },
    { w:'PASTO', m:'grass; pasture' }, { w:'MAGMA', m:'magma' }, { w:'ISTMO', m:'isthmus' },
    { w:'LLANO', m:'plain; flatland' }, { w:'CLIMA', m:'climate' }, { w:'ASTRO', m:'celestial body' },
    { w:'CENIT', m:'zenith' }, { w:'LUNAR', m:'lunar; mole' }, { w:'SOLAR', m:'solar' },
    { w:'ÉPOCA', m:'era; period' }, { w:'VEJEZ', m:'old age' }, { w:'NIÑEZ', m:'childhood' },
    { w:'PRISA', m:'hurry; haste' }, { w:'COBRE', m:'copper' }, { w:'PLOMO', m:'lead (metal)' },
    { w:'ACERO', m:'steel' }, { w:'ÁMBAR', m:'amber' }, { w:'ÓPALO', m:'opal' },
    { w:'ADOBE', m:'adobe' }, { w:'BARRO', m:'mud; clay' }, { w:'LÁTEX', m:'latex' },
    { w:'BETÚN', m:'shoe polish; asphalt' }, { w:'MECHA', m:'fuse; wick' }, { w:'BOMBA', m:'pump; bomb' },
    { w:'PINZA', m:'tweezers; clamp' }, { w:'HACHA', m:'axe' }, { w:'AZADA', m:'hoe' },
    { w:'HORCA', m:'pitchfork; gallows' }, { w:'AGUJA', m:'needle' }, { w:'DEDAL', m:'thimble' },
    { w:'CUERO', m:'leather; hide' }, { w:'TAPIZ', m:'tapestry; rug' }, { w:'TARRO', m:'jar' },
    { w:'CESTO', m:'basket' }, { w:'TAPÓN', m:'plug; cork' }, { w:'CABLE', m:'cable; wire' },
    { w:'JARRO', m:'mug; pitcher' }, { w:'TIARA', m:'tiara' }, { w:'ARETE', m:'earring (LatAm)' },
    { w:'BUQUE', m:'ship; vessel' }, { w:'BALSA', m:'raft' }, { w:'KAYAK', m:'kayak' },
    { w:'VIAJE', m:'trip; journey' }, { w:'BORDO', m:'board; side of ship' }, { w:'PATÍN', m:'skate' },
    { w:'TÚNEL', m:'tunnel' }, { w:'SENDA', m:'path; trail' }, { w:'PISTA', m:'track; runway; clue' },
    { w:'SEÑAL', m:'signal; sign' }, { w:'POSTE', m:'post; pole' }, { w:'BUZÓN', m:'mailbox' },
    { w:'SOBRE', m:'envelope' }, { w:'BULTO', m:'bundle; lump' }, { w:'CARGA', m:'load; cargo' },
    { w:'FLOTA', m:'fleet' }, { w:'TÓRAX', m:'chest; thorax' }, { w:'DORSO', m:'back (of body)' },
    { w:'VENDA', m:'bandage' }, { w:'GRIPE', m:'flu' }, { w:'MAREO', m:'dizziness' },
    { w:'SALTO', m:'jump; leap' }, { w:'CAÍDA', m:'fall; drop' }, { w:'TIRÓN', m:'pull; tug' },
    { w:'CULPA', m:'guilt; fault' },
    { w:'GENTE', m:'people' }, { w:'VARÓN', m:'male (person)' }, { w:'MACHO', m:'male (animal)' },
    { w:'NIETA', m:'granddaughter' }, { w:'SOCIO', m:'partner; member' }, { w:'BRUJO', m:'sorcerer; wizard' },
    { w:'CIRCO', m:'circus' }, { w:'TANTO', m:'point (score)' }, { w:'ÍDOLO', m:'idol' },
    { w:'TURBA', m:'mob; crowd' }, { w:'TURNO', m:'turn; shift' }, { w:'JUNTA', m:'board; meeting' },
    { w:'LUGAR', m:'place' }, { w:'SITIO', m:'place; site' }, { w:'MEDIO', m:'middle; half' },
    { w:'BORDE', m:'edge; rim' }, { w:'PUNTA', m:'tip; point' }, { w:'PUNTO', m:'point; dot' },
    { w:'RAMPA', m:'ramp' }, { w:'GRADA', m:'grandstand; step' }, { w:'DEUDA', m:'debt' },
    { w:'GASTO', m:'expense' }, { w:'COSTE', m:'cost' }, { w:'DÓLAR', m:'dollar' },
    { w:'LIBRA', m:'pound (currency)' }, { w:'RUBLO', m:'ruble' }, { w:'RUPIA', m:'rupee' },
    { w:'NORMA', m:'norm; rule' }, { w:'REGLA', m:'rule; ruler' }, { w:'DEBER', m:'duty; homework' },
    { w:'PRESO', m:'prisoner' }, { w:'PODER', m:'power' }, { w:'MANDO', m:'command; control' },
    { w:'REINO', m:'kingdom' }, { w:'FILÓN', m:'seam; mother lode' }, { w:'LETRA', m:'letter (alphabet)' },
    { w:'FRASE', m:'phrase; sentence' }, { w:'TEXTO', m:'text' }, { w:'VERSO', m:'verse' },
    { w:'VIOLA', m:'viola' }, { w:'CHELO', m:'cello' }, { w:'TELÓN', m:'(theater) curtain' },
    { w:'DIANA', m:'target; bullseye' }, { w:'RODEO', m:'rodeo' }, { w:'ALDEA', m:'village' },
    { w:'VILLA', m:'villa' }, { w:'FONDA', m:'inn' }, { w:'HOTEL', m:'hotel' },
    { w:'MOTEL', m:'motel' }, { w:'CHOZA', m:'hut; shack' }, { w:'TAPIA', m:'wall; adobe wall' },
    { w:'ÁTICO', m:'attic; penthouse' }, { w:'VERJA', m:'fence; gate' }, { w:'VACÍO', m:'empty; void' },
    { w:'NADIE', m:'nobody' }, { w:'DENSO', m:'dense' }, { w:'DÉBIL', m:'weak' },
    { w:'SUAVE', m:'soft; smooth' }, { w:'CLARO', m:'clear; light (color)' }, { w:'OPACO', m:'opaque' },
    { w:'RUBIO', m:'blond' }, { w:'BEIGE', m:'beige' }, { w:'MALVA', m:'mauve; mallow' },
    { w:'ÁRIDO', m:'arid' }, { w:'ANCHO', m:'wide' }, { w:'GRADO', m:'degree; grade' },
    { w:'CURSO', m:'course; school year' }, { w:'CICLO', m:'cycle' }, { w:'OZONO', m:'ozone' },
    { w:'HELIO', m:'helium' }, { w:'ARGÓN', m:'argon' }, { w:'CROMO', m:'chrome; sticker' },
    { w:'NAFTA', m:'gasoline (LatAm)' }, { w:'HULLA', m:'coal' }, { w:'SISAL', m:'sisal (fiber)' },
    { w:'SUELA', m:'sole (of shoe)' }, { w:'TACÓN', m:'heel (of shoe)' }, { w:'BOTÍN', m:'boot; loot' },
    { w:'JUEZA', m:'(female) judge' }, { w:'AZOTE', m:'whip; scourge' }, { w:'FUSTA', m:'riding crop' },
    { w:'JADEO', m:'panting' }, { w:'CALVA', m:'bald spot' }, { w:'ORINA', m:'urine' },
    { w:'PEÑÓN', m:'crag; large rock' }, { w:'BREZO', m:'heather' }, { w:'JASPE', m:'jasper' },
    { w:'ÓNICE', m:'onyx' }, { w:'SEDAL', m:'fishing line' }, { w:'FLETE', m:'freight; shipping' },
    { w:'GRAJA', m:'jackdaw' }, { w:'JIBIA', m:'cuttlefish (Spain)' }, { w:'OTERO', m:'hill; knoll' },
    { w:'TALUD', m:'slope; embankment' }, { w:'NAVÍO', m:'ship; vessel' }, { w:'FERRY', m:'ferry' },
    { w:'SUBTE', m:'subway (Argentina)' }, { w:'MICRO', m:'bus (LatAm)' }, { w:'FLEXO', m:'desk lamp (Spain)' },
    { w:'ESTÍO', m:'summertime' }
  ],
  6: [
    { w:'TIERRA', m:'earth; land' }, { w:'LLUVIA', m:'rain' }, { w:'VIENTO', m:'wind' },
    { w:'NIEBLA', m:'fog' }, { w:'VERANO', m:'summer' }, { w:'BOSQUE', m:'forest' },
    { w:'JARDÍN', m:'garden' }, { w:'VOLCÁN', m:'volcano' }, { w:'TOMATE', m:'tomato' },
    { w:'ACEITE', m:'oil' }, { w:'AZÚCAR', m:'sugar' }, { w:'COCINA', m:'kitchen; cooking' },
    { w:'HARINA', m:'flour' }, { w:'PASTEL', m:'cake' }, { w:'HELADO', m:'ice cream' },
    { w:'SANDÍA', m:'watermelon' }, { w:'PUERTA', m:'door' }, { w:'ESPEJO', m:'mirror' },
    { w:'MONEDA', m:'coin' }, { w:'ANILLO', m:'ring' }, { w:'TESORO', m:'treasure' },
    { w:'SILLÓN', m:'armchair' }, { w:'SÓTANO', m:'basement; cellar' }, { w:'PUENTE', m:'bridge' },
    { w:'CAMINO', m:'path; road' }, { w:'CIUDAD', m:'city' }, { w:'PUEBLO', m:'town; village' },
    { w:'PUERTO', m:'port; harbor' }, { w:'CAMIÓN', m:'truck' }, { w:'ESPOSO', m:'husband' },
    { w:'ESPOSA', m:'wife' }, { w:'VECINO', m:'neighbor' }, { w:'SEÑORA', m:'lady; madam' },
    { w:'CUÑADO', m:'brother-in-law' }, { w:'ESPADA', m:'sword' }, { w:'ESCUDO', m:'shield' },
    { w:'FLECHA', m:'arrow' }, { w:'DRAGÓN', m:'dragon' }, { w:'TAMBOR', m:'drum' },
    { w:'VIOLÍN', m:'violin' }, { w:'TEATRO', m:'theater' }, { w:'MÚSICA', m:'music' },
    { w:'CABEZA', m:'head' }, { w:'DIENTE', m:'tooth' }, { w:'CUELLO', m:'neck' },
    { w:'MUÑECA', m:'wrist; doll' }, { w:'SANGRE', m:'blood' }, { w:'MÉDICO', m:'doctor' },
    { w:'CAMISA', m:'shirt' }, { w:'ZAPATO', m:'shoe' },
    { w:'MANTEL', m:'tablecloth' }, { w:'TOALLA', m:'towel' }, { w:'CADENA', m:'chain' },
    { w:'COLLAR', m:'necklace' }, { w:'BARRIO', m:'neighborhood' }, { w:'MUEBLE', m:'piece of furniture' },
    { w:'GARAJE', m:'garage' }, { w:'SUEGRO', m:'father-in-law' }, { w:'FLAUTA', m:'flute' },
    { w:'ACTRIZ', m:'actress' }, { w:'CARTEL', m:'poster' }, { w:'CORREO', m:'mail; post office' },
    { w:'REGALO', m:'gift' }, { w:'FIESTA', m:'party' }, { w:'CEREAL', m:'cereal' },
    { w:'CEBADA', m:'barley' }, { w:'DIBUJO', m:'drawing' }, { w:'PINTOR', m:'painter' },
    { w:'FÍSICA', m:'physics' }, { w:'IDIOMA', m:'language' }, { w:'PÁGINA', m:'page' },
    { w:'TÍTULO', m:'title' }, { w:'LECTOR', m:'reader' }, { w:'NOVELA', m:'novel' },
    { w:'POESÍA', m:'poetry' }, { w:'CUENTO', m:'short story; tale' }, { w:'FÁBULA', m:'fable' },
    { w:'HOMBRO', m:'shoulder' }, { w:'NERVIO', m:'nerve' }, { w:'PULMÓN', m:'lung' },
    { w:'HÍGADO', m:'liver' }, { w:'FIEBRE', m:'fever' }, { w:'JARABE', m:'syrup' },
    { w:'VACUNA', m:'vaccine' }, { w:'HERIDA', m:'wound' }, { w:'ABRIGO', m:'coat' },
    { w:'SUÉTER', m:'sweater' }, { w:'GUANTE', m:'glove' }, { w:'SARTÉN', m:'frying pan' },
    { w:'NEVERA', m:'fridge' }, { w:'ESTUFA', m:'stove; heater' }, { w:'CENIZA', m:'ash' },
    { w:'CHISPA', m:'spark' }, { w:'PIEDRA', m:'stone' }, { w:'ESPUMA', m:'foam' },
    { w:'CONCHA', m:'shell' }, { w:'ORILLA', m:'shore; edge' }, { w:'CUMBRE', m:'summit' },
    { w:'LADERA', m:'slope' }, { w:'CRÁTER', m:'crater' },
    { w:'TRUENO', m:'thunder' }, { w:'ESPINA', m:'thorn' }, { w:'PATATA', m:'potato' },
    { w:'SALERO', m:'saltshaker' }, { w:'SUEGRA', m:'mother-in-law' }, { w:'AMANTE', m:'lover' },
    { w:'OBISPO', m:'bishop' }, { w:'FRAILE', m:'friar' }, { w:'POSTRE', m:'dessert' },
    { w:'FUENTE', m:'fountain; source' }, { w:'EXAMEN', m:'exam' }, { w:'ALUMNO', m:'student' },
    { w:'RECREO', m:'recess' }, { w:'APUNTE', m:'note' }, { w:'ACENTO', m:'accent' },
    { w:'SÍLABA', m:'syllable' }, { w:'PLANTA', m:'plant; sole (of foot)' }, { w:'VEJIGA', m:'bladder' },
    { w:'SALIVA', m:'saliva' }, { w:'ESTILO', m:'style' }, { w:'HOLLÍN', m:'soot' },
    { w:'PINCHO', m:'skewer; snack' }, { w:'PAELLA', m:'paella (rice dish)' }, { w:'PEPINO', m:'cucumber' },
    { w:'ACELGA', m:'chard' }, { w:'CANELA', m:'cinnamon' }, { w:'COMINO', m:'cumin' },
    { w:'CEREZA', m:'cherry' }, { w:'PAPAYA', m:'papaya' },
    { w:'BANANA', m:'banana (LatAm)' }, { w:'POMELO', m:'grapefruit' }, { w:'CONEJO', m:'rabbit' },
    { w:'IGUANA', m:'iguana' }, { w:'CIERVO', m:'deer' }, { w:'JABALÍ', m:'wild boar' },
    { w:'COYOTE', m:'coyote' }, { w:'PALOMA', m:'dove; pigeon' }, { w:'NARVAL', m:'narwhal' },
    { w:'TRUCHA', m:'trout' }, { w:'ALMEJA', m:'clam' }, { w:'MEDUSA', m:'jellyfish' },
    { w:'AVISPA', m:'wasp' }, { w:'GRILLO', m:'cricket' }, { w:'GUSANO', m:'worm' },
    { w:'OLEAJE', m:'surf' }, { w:'ISLOTE', m:'islet' }, { w:'RIBERA', m:'riverbank' },
    { w:'ESTEPA', m:'steppe' }, { w:'SABANA', m:'savanna' }, { w:'MESETA', m:'plateau' },
    { w:'MINUTO', m:'minute' }, { w:'SEMANA', m:'week' }, { w:'PASADO', m:'past' },
    { w:'FUTURO', m:'future' }, { w:'SUERTE', m:'luck' }, { w:'VERDAD', m:'truth' },
    { w:'ANHELO', m:'longing' }, { w:'PÁNICO', m:'panic' }, { w:'TERROR', m:'terror' },
    { w:'CORAJE', m:'anger; courage' }, { w:'CARIÑO', m:'affection' }, { w:'AFECTO', m:'affection' },
    { w:'LLANTO', m:'crying; weeping' }, { w:'GUERRA', m:'war' },
    { w:'RUTINA', m:'routine' }, { w:'HÁBITO', m:'habit' },
    { w:'BÚFALO', m:'buffalo' }, { w:'JIRAFA', m:'giraffe' }, { w:'DELFÍN', m:'dolphin' },
    { w:'CASTOR', m:'beaver' }, { w:'LIEBRE', m:'hare' }, { w:'JAGUAR', m:'jaguar' },
    { w:'GACELA', m:'gazelle' }, { w:'GANADO', m:'cattle; livestock' }, { w:'REBAÑO', m:'flock; herd' },
    { w:'MANADA', m:'pack; herd' }, { w:'CORRAL', m:'corral; pen' }, { w:'HALCÓN', m:'falcon; hawk' },
    { w:'PERICO', m:'parakeet' }, { w:'CUERVO', m:'raven' }, { w:'URRACA', m:'magpie' },
    { w:'FAISÁN', m:'pheasant' }, { w:'PERDIZ', m:'partridge' }, { w:'ÁGUILA', m:'eagle' },
    { w:'BUITRE', m:'vulture' }, { w:'SALMÓN', m:'salmon' }, { w:'ANCHOA', m:'anchovy' },
    { w:'CIGALA', m:'Norway lobster' }, { w:'BABOSA', m:'slug' }, { w:'PULGÓN', m:'aphid; greenfly' },
    { w:'VÍBORA', m:'viper' }, { w:'COLINA', m:'hill' }, { w:'CHARCO', m:'puddle' },
    { w:'LAGUNA', m:'lagoon' }, { w:'ARROYO', m:'stream; creek' }, { w:'GÉISER', m:'geyser' },
    { w:'NEVADA', m:'snowfall' }, { w:'CICLÓN', m:'cyclone' }, { w:'MONZÓN', m:'monsoon' },
    { w:'UMBRÍA', m:'shady side' }, { w:'COMETA', m:'comet; kite' }, { w:'COMPÁS', m:'compass; beat' },
    { w:'MIMOSA', m:'mimosa' }, { w:'ACACIA', m:'acacia' }, { w:'CLAVEL', m:'carnation' },
    { w:'JAZMÍN', m:'jasmine' }, { w:'TRÉBOL', m:'clover' }, { w:'HIEDRA', m:'ivy' },
    { w:'RÁBANO', m:'radish' }, { w:'PUERRO', m:'leek' }, { w:'ROMERO', m:'rosemary' },
    { w:'LAUREL', m:'laurel; bay' }, { w:'SALVIA', m:'sage' }, { w:'CIPRÉS', m:'cypress' },
    { w:'ENCINA', m:'holm oak' }, { w:'FRESNO', m:'ash tree' }, { w:'FRENTE', m:'forehead' },
    { w:'PUPILA', m:'pupil (eye)' }, { w:'BIGOTE', m:'mustache' }, { w:'PÓMULO', m:'cheekbone' },
    { w:'LENGUA', m:'tongue; language' }, { w:'PULGAR', m:'thumb' }, { w:'ÍNDICE', m:'index finger' },
    { w:'ANULAR', m:'ring finger' }, { w:'CRÁNEO', m:'skull' }, { w:'MÉDULA', m:'marrow' },
    { w:'TENDÓN', m:'tendon' }, { w:'ARRUGA', m:'wrinkle' }, { w:'JERSEY', m:'sweater (Spain)' },
    { w:'PIJAMA', m:'pajamas' }, { w:'CORREA', m:'strap; leash' }, { w:'CIERRE', m:'zipper; clasp' },
    { w:'SOLAPA', m:'lapel' }, { w:'PRENDA', m:'garment' }, { w:'GÉNERO', m:'fabric; genre' },
    { w:'SASTRE', m:'tailor' }, { w:'TRENZA', m:'braid' }, { w:'MELENA', m:'mane; long hair' },
    { w:'COLETA', m:'ponytail' }, { w:'PELUCA', m:'wig' }, { w:'NAVAJA', m:'razor; pocketknife' },
    { w:'TIJERA', m:'scissors' }, { w:'BARNIZ', m:'varnish; nail polish' }, { w:'CUARTO', m:'room' },
    { w:'BALCÓN', m:'balcony' }, { w:'TIMBRE', m:'doorbell' }, { w:'FAROLA', m:'streetlight' },
    { w:'LAVABO', m:'washbasin; sink' }, { w:'SÁBANA', m:'bed sheet' }, { w:'MESITA', m:'nightstand' },
    { w:'BUTACA', m:'armchair' }, { w:'REPISA', m:'shelf' }, { w:'ROPERO', m:'wardrobe' },
    { w:'CÓMODA', m:'dresser' }, { w:'GAVETA', m:'drawer (LatAm)' }, { w:'PERCHA', m:'hanger' },
    { w:'GANCHO', m:'hook' }, { w:'ESCOBA', m:'broom' }, { w:'CHURRO', m:'churro' },
    { w:'TURRÓN', m:'nougat' }, { w:'BOMBÓN', m:'chocolate candy' }, { w:'BATIDO', m:'milkshake' },
    { w:'COHETE', m:'rocket; firework' }, { w:'VELERO', m:'sailboat' }, { w:'GALEÓN', m:'galleon' },
    { w:'MUELLE', m:'dock; pier' },
    { w:'PARQUE', m:'park' }, { w:'PASAJE', m:'passage' }, { w:'VEREDA', m:'path; sidewalk' }, 
    { w:'DESVÍO', m:'detour' }, { w:'ENLACE', m:'link; connection' }, { w:'CUERDA', m:'rope; string' }, 
    { w:'BROCHE', m:'clasp; brooch' }, { w:'VIDRIO', m:'glass' }, { w:'CUADRO', m:'picture; painting' }, 
    { w:'LIENZO', m:'canvas' }, { w:'ÓRBITA', m:'orbit' }, { w:'OCÉANO', m:'ocean' }, { w:'CUESTA', m:'slope; hill' }, 
    { w:'QUINTA', m:'country house' }, { w:'CHACRA', m:'farm (LatAm)' }, { w:'RANCHO', m:'ranch' }, 
    { w:'MORADA', m:'dwelling' }, { w:'CHALET', m:'chalet' }, { w:'CABAÑA', m:'cabin' }, { w:'SECTOR', m:'sector' }, 
    { w:'LÍMITE', m:'limit' }, { w:'HUERTO', m:'orchard' }, { w:'HUERTA', m:'vegetable garden' }, 
    { w:'VIÑEDO', m:'vineyard' }, { w:'OLIVAR', m:'olive grove' }, { w:'TRIGAL', m:'wheat field' }, 
    { w:'MAIZAL', m:'cornfield' }, { w:'TUERCA', m:'nut (hardware)' }, { w:'PISTÓN', m:'piston' }, 
    { w:'LLAVÍN', m:'small key' }, { w:'SEGURO', m:'lock; insurance' }, { w:'ALARMA', m:'alarm' }, 
    { w:'SIRENA', m:'siren' }, { w:'BOCINA', m:'horn' }, { w:'SONIDO', m:'sound' }, { w:'ACORDE', m:'chord' }, 
    { w:'RECADO', m:'message; errand' }, { w:'NACIÓN', m:'nation' }, { w:'ACCIÓN', m:'action' }, 
    { w:'PASIÓN', m:'passion' }, { w:'VISIÓN', m:'vision' }, { w:'MISIÓN', m:'mission' }, { w:'LEGIÓN', m:'legion' }, 
    { w:'REGIÓN', m:'region' }, { w:'SESIÓN', m:'session' }, { w:'RACIÓN', m:'ration' }, { w:'RINCÓN', m:'corner' }, 
    { w:'DOCTOR', m:'doctor' }, { w:'PASTOR', m:'shepherd; pastor' }, { w:'NOMBRE', m:'name' }, { w:'EQUIPO', m:'team; equipment' }, 
    { w:'FIGURA', m:'figure' }, { w:'CUERPO', m:'body' }, { w:'OLFATO', m:'smell; sense of smell' }, { w:'TRAMPA', m:'trap' }, 
    { w:'CÁRCEL', m:'jail; prison' }, { w:'BROCHA', m:'brush' }, { w:'PINCEL', m:'paintbrush' }, { w:'DIARIO', m:'daily; diary' }, 
    { w:'NÚMERO', m:'number' }, { w:'ALERTA', m:'alert' }, { w:'RIESGO', m:'risk' }, { w:'VIRGEN', m:'virgin' }, 
    { w:'DIABLO', m:'devil' }, { w:'TEMPLO', m:'temple' }, { w:'BIBLIA', m:'Bible' }, { w:'CUATRO', m:'four' }, 
    { w:'MILLÓN', m:'million' }, { w:'BILLÓN', m:'billion' }, { w:'TRIPLE', m:'triple' }, { w:'SIMPLE', m:'simple' }, 
    { w:'ADULTO', m:'adult' }, { w:'HOMBRE', m:'man' }, { w:'PAREJA', m:'couple; partner' }, { w:'ABUELO', m:'grandfather' }, 
    { w:'ABUELA', m:'grandmother' }, { w:'ESTADO', m:'state' }, { w:'BOLETO', m:'ticket' }, { w:'TICKET', m:'ticket' }, 
    { w:'SALIDA', m:'exit; departure' }, { w:'LLANTA', m:'tire' }, { w:'DIÉSEL', m:'diesel' }, { w:'BASURA', m:'trash; garbage' }, 
    { w:'TAMAÑO', m:'size' }, { w:'MEDIDA', m:'measure' }, { w:'MAÑANA', m:'morning; tomorrow' }, { w:'AURORA', m:'dawn' }, 
    { w:'TIEMPO', m:'time; weather' }, { w:'TEORÍA', m:'theory' }, { w:'UNIDAD', m:'unit' }, 
    { w:'EMPLEO', m:'employment; job' }, { w:'OFICIO', m:'trade; office' }, { w:'PUESTO', m:'position; stall' }, 
    { w:'CAMBIO', m:'change' }, { w:'AVANCE', m:'advance; progress' }, { w:'SUBIDA', m:'ascent; rise' }, { w:'BAJADA', m:'descent; drop' }, 
    { w:'GRANDE', m:'big; large' }, { w:'BLANCO', m:'white' },
    { w:'SEQUÍA', m:'drought' }, { w:'JUNGLA', m:'jungle' }, { w:'FIORDO', m:'fjord' },
    { w:'HIERRO', m:'iron' }, { w:'ESTAÑO', m:'tin' }, { w:'NÍQUEL', m:'nickel' },
    { w:'AZUFRE', m:'sulfur' }, { w:'CADERA', m:'hip' }, { w:'ROSTRO', m:'face' },
    { w:'FRIJOL', m:'bean (LatAm)' }, { w:'TOCINO', m:'bacon' }, { w:'LUBINA', m:'sea bass' },
    { w:'DORADA', m:'sea bream' }, { w:'ROSCÓN', m:'ring-shaped cake' }, { w:'CUENCO', m:'bowl' },
    { w:'JARRÓN', m:'vase' }, { w:'AZOTEA', m:'rooftop' }, { w:'TEJADO', m:'roof' },
    { w:'ESTERA', m:'mat' }, { w:'COLCHA', m:'bedspread' }, { w:'ZÓCALO', m:'baseboard' },
    { w:'PORTAL', m:'entrance hall' }, { w:'CRIADO', m:'servant' }, { w:'PATRÓN', m:'boss; pattern' },
    { w:'OBRERO', m:'worker' }, { w:'MINERO', m:'miner' }, { w:'FISCAL', m:'prosecutor' },
    { w:'PILOTO', m:'pilot' }, { w:'CHÓFER', m:'driver' }, { w:'MESERO', m:'waiter (LatAm)' },
    { w:'MÚSICO', m:'musician' }, { w:'TIENDA', m:'shop; tent' }, { w:'CARRIL', m:'lane' },
    { w:'FURGÓN', m:'van; boxcar' }, { w:'LANCHA', m:'motorboat' }, { w:'CESTÓN', m:'large basket' },
    { w:'GOTERA', m:'leak; drip' }, { w:'ALJIBE', m:'cistern' }, { w:'TANQUE', m:'tank' },
    { w:'TETERA', m:'teapot' }, { w:'ALPACA', m:'alpaca' }, { w:'VICUÑA', m:'vicuña' },
    { w:'GORILA', m:'gorilla' }, { w:'NUTRIA', m:'otter' }, { w:'ARMIÑO', m:'ermine' },
    { w:'MOFETA', m:'skunk' }, { w:'VENADO', m:'deer (LatAm)' }, { w:'MUFLÓN', m:'mouflon' },
    { w:'HEMBRA', m:'female' }, { w:'PINZÓN', m:'finch' }, { w:'ZORZAL', m:'thrush' },
    { w:'CÁRABO', m:'tawny owl' }, { w:'MILANO', m:'kite (bird)' }, { w:'TRITÓN', m:'newt' },
    { w:'CAIMÁN', m:'caiman' }, { w:'GAVIAL', m:'gharial' }, { w:'MIGALA', m:'tarantula (LatAm)' },
    { w:'MECHÓN', m:'lock of hair' }, { w:'TÁBANO', m:'horsefly' }, { w:'ABISMO', m:'abyss' },
    { w:'SIERRA', m:'mountain range; saw' }, { w:'ATOLÓN', m:'atoll' }, { w:'CHORRO', m:'jet; stream' },
    { w:'ALMENA', m:'battlement' }, { w:'FORTÍN', m:'small fort' }, { w:'BÚNKER', m:'bunker' },
    { w:'MULETA', m:'crutch' }, { w:'AGONÍA', m:'agony' }, { w:'MUERTE', m:'death' },
    { w:'GEMIDO', m:'groan; moan' }, { w:'JÚBILO', m:'jubilation' }, { w:'HORROR', m:'horror' },
    { w:'ENFADO', m:'anger' }, { w:'DESDÉN', m:'disdain' }, { w:'RECATO', m:'modesty' },
    { w:'BONDAD', m:'kindness' }, { w:'MALDAD', m:'evil; wickedness' }, { w:'ENGAÑO', m:'deceit' },
    { w:'FRAUDE', m:'fraud' }, { w:'ESTAFA', m:'scam' }, { w:'LADRÓN', m:'thief' },
    { w:'ESTACA', m:'stake' }, { w:'BASTÓN', m:'cane; staff' }, { w:'CAYADO', m:'shepherd’s crook' },
    { w:'MACETA', m:'flowerpot' }, { w:'TRILLO', m:'harrow' }, { w:'PÁJARO', m:'bird' },
    { w:'ORIGEN', m:'origin' }, { w:'VUELTA', m:'return; turn' }, { w:'TROCHA', m:'narrow path' },
    { w:'AURIGA', m:'charioteer' }, { w:'ÁRTICO', m:'Arctic' }, { w:'TUNDRA', m:'tundra' },
    { w:'MALEZA', m:'undergrowth; weeds' }, { w:'ESPINO', m:'thornbush' }, { w:'ZARZAL', m:'bramble patch' },
    { w:'BREZAL', m:'heath' }, { w:'PÁRAMO', m:'moor; wasteland' }, { w:'DEHESA', m:'pasture; ranchland' },
    { w:'CRIPTA', m:'crypt' },
    { w:'GRANJA', m:'farm' }, { w:'PUERCO', m:'pig' }, { w:'MACACO', m:'macaque' },
    { w:'GRULLA', m:'crane (bird)' }, { w:'RETINA', m:'retina' }, { w:'CÓRNEA', m:'cornea' },
    { w:'COSTRA', m:'scab' }, { w:'OVEROL', m:'overalls (LatAm)' }, { w:'GAMUZA', m:'suede; chamois' },
    { w:'BAÑERA', m:'bathtub' }, { w:'TRASTO', m:'dish; old thing' }, { w:'CUBETA', m:'bucket (LatAm)' },
    { w:'TAPETE', m:'rug; mat (LatAm)' }, { w:'PORCHE', m:'porch' }, { w:'KIOSCO', m:'kiosk' },
    { w:'CÉSPED', m:'lawn; grass' }, { w:'TIESTO', m:'flowerpot' }, { w:'TRONCO', m:'trunk' },
    { w:'RESINA', m:'resin' }, { w:'PÉTALO', m:'petal' }, { w:'ARVEJA', m:'pea (LatAm)' },
    { w:'CAYENA', m:'cayenne' }, { w:'LASAÑA', m:'lasagna' }, { w:'POTAJE', m:'stew; potage' },
    { w:'COCIDO', m:'chickpea stew' }, { w:'FILETE', m:'fillet; steak' }, { w:'SÉMOLA', m:'semolina' },
    { w:'QUINUA', m:'quinoa' }, { w:'NÉCTAR', m:'nectar' }, { w:'VERMUT', m:'vermouth' },
    { w:'WHISKY', m:'whisky' }, { w:'MEZCAL', m:'mezcal' }, { w:'PULQUE', m:'pulque' },
    { w:'CHICHA', m:'chicha (drink)' }, { w:'CÓCTEL', m:'cocktail' }, { w:'RÓTULO', m:'sign; billboard' },
    { w:'PARADA', m:'(bus) stop' }, { w:'SILLÍN', m:'bicycle seat' }, { w:'GARFIO', m:'hook' },
    { w:'PEZUÑA', m:'hoof' }, { w:'CUERNO', m:'horn' }, { w:'JOYERO', m:'jeweler; jewelry box' },
    { w:'MARINO', m:'sailor; marine' }, { w:'CAJERO', m:'cashier; ATM' }, { w:'CÁMARA', m:'camera; chamber' },
    { w:'EDITOR', m:'editor' }, { w:'CHARRO', m:'Mexican horseman' }, { w:'GAUCHO', m:'gaucho' },
    { w:'JURADO', m:'jury' }, { w:'ATRACO', m:'robbery; holdup' }, { w:'DEUDOR', m:'debtor' },
    { w:'AHORRO', m:'savings' }, { w:'SUELDO', m:'salary' }, { w:'JORNAL', m:'day wage' },
    { w:'NÓMINA', m:'payroll' }, { w:'ASUETO', m:'day off' }, { w:'PELOTA', m:'ball' },
    { w:'FÚTBOL', m:'soccer' }, { w:'HINCHA', m:'fan (supporter)' }, { w:'EMPATE', m:'tie; draw' },
    { w:'TROFEO', m:'trophy' }, { w:'PREMIO', m:'prize; award' }, { w:'TORNEO', m:'tournament' },
    { w:'ATLETA', m:'athlete' }, { w:'REGATA', m:'regatta' }, { w:'QUILLA', m:'keel' },
    { w:'HÉLICE', m:'propeller' }, { w:'CLAXON', m:'car horn' }, { w:'MARCHA', m:'gear; march' },
    { w:'TALLER', m:'workshop' }, { w:'TENAZA', m:'tongs; pincers' }, { w:'BÓVEDA', m:'vault' },
    { w:'CÚPULA', m:'dome' }, { w:'BODEGA', m:'wine cellar; cellar' }, { w:'BARRIL', m:'barrel' },
    { w:'TINAJA', m:'earthenware jar' }, { w:'VASIJA', m:'vessel; pot' }, { w:'ÁNFORA', m:'amphora' },
    { w:'PECADO', m:'sin' }, { w:'VIRTUD', m:'virtue' }, { w:'GRACIA', m:'grace' },
    { w:'GLORIA', m:'glory' }, { w:'MÁRTIR', m:'martyr' }, { w:'ERMITA', m:'hermitage' },
    { w:'ABADÍA', m:'abbey' }, { w:'FOGATA', m:'bonfire' }, { w:'FUERZA', m:'force; strength' },
    { w:'ESFERA', m:'sphere' }, { w:'PRISMA', m:'prism' }, { w:'ÁNGULO', m:'angle' },
    { w:'ESCALA', m:'scale; ladder' }, { w:'MARGEN', m:'margin' }, { w:'CENTRO', m:'center' },
    { w:'COSMOS', m:'cosmos' }, { w:'MOLINO', m:'mill' }, { w:'SALAMI', m:'salami' },
    { w:'PALETA', m:'palette; paddle' }, { w:'CÓDIGO', m:'code' }, { w:'CUENTA', m:'account; bill' },
    { w:'CASERO', m:'landlord; homemade' }
  ],
  7: [
    { w:'VENTANA', m:'window' }, { w:'SEMILLA', m:'seed' }, { w:'NARANJA', m:'orange' },
    { w:'PLÁTANO', m:'banana; plantain' }, { w:'CEBOLLA', m:'onion' }, { w:'LECHUGA', m:'lettuce' },
    { w:'CERVEZA', m:'beer' }, { w:'BOTELLA', m:'bottle' }, { w:'TENEDOR', m:'fork' },
    { w:'CUCHARA', m:'spoon' }, { w:'GALLETA', m:'cookie' }, { w:'PESCADO', m:'fish (food)' },
    { w:'TIBURÓN', m:'shark' }, { w:'BALLENA', m:'whale' }, { w:'LECHUZA', m:'owl' },
    { w:'GORRIÓN', m:'sparrow' }, { w:'CABALLO', m:'horse' }, { w:'CAMELLO', m:'camel' },
    { w:'TORTUGA', m:'turtle' }, { w:'MAPACHE', m:'raccoon' }, { w:'ALACRÁN', m:'scorpion' },
    { w:'CARACOL', m:'snail' }, { w:'HORMIGA', m:'ant' }, { w:'ARDILLA', m:'squirrel' },
    { w:'CORTINA', m:'curtain' }, { w:'COLCHÓN', m:'mattress' }, { w:'ARMARIO', m:'wardrobe; closet' },
    { w:'CEPILLO', m:'brush' }, { w:'CANDADO', m:'padlock' }, { w:'IGLESIA', m:'church' },
    { w:'MERCADO', m:'market' }, { w:'PALACIO', m:'palace' }, { w:'ESTABLO', m:'stable' },
    { w:'GRANERO', m:'barn' }, { w:'FÁBRICA', m:'factory' }, { w:'OFICINA', m:'office' },
    { w:'EMPRESA', m:'company' }, { w:'BILLETE', m:'banknote; ticket' }, { w:'MAESTRO', m:'teacher' },
    { w:'ESCUELA', m:'school' }, { w:'POLICÍA', m:'police officer' }, { w:'SOLDADO', m:'soldier' },
    { w:'PALABRA', m:'word' }, { w:'MENSAJE', m:'message' }, { w:'MONTAÑA', m:'mountain' },
    { w:'BRÚJULA', m:'compass' }, { w:'AUTOBÚS', m:'bus' }, { w:'HURACÁN', m:'hurricane' },
    { w:'PLANETA', m:'planet' }, { w:'GALAXIA', m:'galaxy' }, { w:'CONVITE', m:'treat; invitation' },
    { w:'CIRUELA', m:'plum' }, { w:'GUAYABA', m:'guava' }, { w:'TORONJA', m:'grapefruit' },
    { w:'BACALAO', m:'cod' }, { w:'SARDINA', m:'sardine' }, { w:'ANGUILA', m:'eel' },
    { w:'CALAMAR', m:'squid' }, { w:'CANARIO', m:'canary' }, { w:'CANGURO', m:'kangaroo' },
    { w:'BABUINO', m:'baboon' }, { w:'QUETZAL', m:'quetzal' }, { w:'POLILLA', m:'moth' },
    { w:'CIGARRA', m:'cicada' }, { w:'TERMITA', m:'termite' }, { w:'PANTERA', m:'panther' },
    { w:'LOMBRIZ', m:'worm' }, { w:'LAGARTO', m:'lizard' }, { w:'EDREDÓN', m:'comforter' },
    { w:'ESTANTE', m:'shelf' }, { w:'SECADOR', m:'dryer' }, { w:'CAMPANA', m:'bell' },
    { w:'SILBATO', m:'whistle' }, { w:'INODORO', m:'toilet' }, { w:'FREGONA', m:'mop' },
    { w:'TUBERÍA', m:'pipe' }, { w:'CAPILLA', m:'chapel' }, { w:'TABERNA', m:'tavern' },
    { w:'ESTADIO', m:'stadium' }, { w:'PISCINA', m:'pool' }, { w:'ACUARIO', m:'aquarium' },
    { w:'MURALLA', m:'fortress wall' }, { w:'COLEGIO', m:'school' }, { w:'CUARTEL', m:'barracks' },
    { w:'PRISIÓN', m:'prison' }, { w:'TESTIGO', m:'witness' }, { w:'PISTOLA', m:'pistol' },
    { w:'PÓLVORA', m:'gunpowder' }, { w:'REINADO', m:'reign' }, { w:'DUQUESA', m:'duchess' },
    { w:'CONDESA', m:'countess' }, { w:'GENERAL', m:'general' }, { w:'CAPITÁN', m:'captain' },
    { w:'CAZADOR', m:'hunter' }, { w:'CARTERO', m:'mail carrier' }, { w:'CLIENTE', m:'customer' },
    { w:'GERENTE', m:'manager' }, { w:'BARBERO', m:'barber' }, { w:'HERRERO', m:'blacksmith' },
    { w:'LEÑADOR', m:'lumberjack' }, { w:'ALBAÑIL', m:'bricklayer' },
    { w:'CORTIJO', m:'farmhouse' }, { w:'ALAMEDA', m:'promenade' }, { w:'BULEVAR', m:'boulevard' },
    { w:'COLONIA', m:'colony' }, { w:'COMARCA', m:'district; region' }, { w:'AVENIDA', m:'avenue' },
    { w:'REFLEJO', m:'reflection' }, { w:'ILUSIÓN', m:'illusion' }, { w:'REGRESO', m:'return' },
    { w:'PARTIDA', m:'departure; match' }, { w:'LLEGADA', m:'arrival' }, { w:'CROQUIS', m:'sketch' },
    { w:'REMADOR', m:'rower' }, { w:'CORDAJE', m:'rigging' }, { w:'NÁUTICA', m:'seamanship' },
    { w:'FÓSFORO', m:'match' }, { w:'CERILLA', m:'match' }, { w:'MECHERO', m:'lighter' },
    { w:'QUINQUÉ', m:'oil lamp' }, { w:'CANDELA', m:'candle' }, { w:'CANTINA', m:'canteen' },
    { w:'ABANICO', m:'fan' }, { w:'DAMASCO', m:'apricot' }, { w:'NÍSPERO', m:'loquat' },
    { w:'ENDIVIA', m:'endive' }, { w:'AZAFRÁN', m:'saffron' }, { w:'CÚRCUMA', m:'turmeric' },
    { w:'TOMILLO', m:'thyme' }, { w:'CULTIVO', m:'cultivation; crop' }, { w:'TRACTOR', m:'tractor' },
    { w:'EMBALSE', m:'reservoir' }, { w:'ACEQUIA', m:'irrigation ditch' }, { w:'GUADAÑA', m:'scythe' },
    { w:'MACHETE', m:'machete' }, { w:'PALOMAR', m:'dovecote' }, { w:'TORREÓN', m:'tower; keep' },
    { w:'DECRETO', m:'decree' }, { w:'DIADEMA', m:'diadem; tiara' }, { w:'RETABLO', m:'altarpiece' },
    { w:'PANTEÓN', m:'pantheon; mausoleum' }, { w:'CASTAÑO', m:'chestnut tree' }, { w:'CASTAÑA', m:'chestnut' },
    { w:'MANZANO', m:'apple tree' }, { w:'NARANJO', m:'orange tree' }, { w:'GRANADO', m:'pomegranate tree' },
    { w:'MADROÑO', m:'strawberry tree' }, { w:'HIGUERA', m:'fig tree' }, { w:'LAVANDA', m:'lavender' },
    { w:'ESPARTO', m:'esparto grass' }, { w:'CARRIZO', m:'reed' }, { w:'ALFALFA', m:'alfalfa' },
    { w:'CENTENO', m:'rye' }, { w:'COSECHA', m:'harvest' }, { w:'SIEMBRA', m:'sowing' },
    { w:'PRADERA', m:'meadow' }, { w:'ARBUSTO', m:'shrub' }, { w:'FOLLAJE', m:'foliage' },
    { w:'PERFUME', m:'perfume' }, { w:'ESENCIA', m:'essence' }, { w:'ANÉMONA', m:'sea anemone' },
    { w:'COLMENA', m:'beehive' }, { w:'AVISPÓN', m:'hornet' }, { w:'CHINCHE', m:'bedbug' },
    { w:'TERRAZA', m:'terrace' }, { w:'MUDANZA', m:'(house) move' }, { w:'ENCHUFE', m:'plug; socket' },
    { w:'BATERÍA', m:'battery' }, { w:'APARATO', m:'device; appliance' }, { w:'LÁMPARA', m:'lamp' },
    { w:'TITULAR', m:'headline' }, { w:'PORTADA', m:'front page; cover' }, { w:'SECCIÓN', m:'section' },
    { w:'ANUNCIO', m:'advertisement' }, { w:'TABLETA', m:'tablet' }, { w:'CELULAR', m:'cell phone' },
    { w:'ALTAVOZ', m:'speaker' }, { w:'TRÍPODE', m:'tripod' }, { w:'CIRUGÍA', m:'surgery' },
    { w:'TERAPIA', m:'therapy' }, { w:'HIGIENE', m:'hygiene' }, { w:'MINERAL', m:'mineral' },
    { w:'POTASIO', m:'potassium' }, { w:'OXÍGENO', m:'oxygen' }, { w:'CARBONO', m:'carbon' },
    { w:'ENERGÍA', m:'energy' }, { w:'ÁLGEBRA', m:'algebra' }, { w:'FÓRMULA', m:'formula' },
    { w:'TEOREMA', m:'theorem' }, { w:'CÁLCULO', m:'calculation' }, { w:'AMISTAD', m:'friendship' },
    { w:'ALEGRÍA', m:'joy' }, { w:'ENVIDIA', m:'envy' }, { w:'ORGULLO', m:'pride' },
    { w:'TERNURA', m:'tenderness' }, { w:'CULTURA', m:'culture' }, { w:'LLANURA', m:'plain' },
    { w:'CORTEZA', m:'bark; crust' }, { w:'RAPIDEZ', m:'speed' }, { w:'DULZURA', m:'sweetness' },
    { w:'AUDACIA', m:'boldness' },
    { w:'GAVIOTA', m:'seagull' }, { w:'CIGÜEÑA', m:'stork' }, { w:'COTORRA', m:'parrot' },
    { w:'OCELOTE', m:'ocelot' }, { w:'GUANACO', m:'guanaco' }, { w:'BISONTE', m:'bison' },
    { w:'CORDERO', m:'lamb' }, { w:'NOVILLO', m:'steer; young bull' }, { w:'GALLINA', m:'hen' },
    { w:'COLIBRÍ', m:'hummingbird' }, { w:'MERLUZA', m:'hake' }, { w:'CABALLA', m:'mackerel' },
    { w:'CAMARÓN', m:'shrimp' }, { w:'MARSOPA', m:'porpoise' }, { w:'HÁMSTER', m:'hamster' },
    { w:'MARMOTA', m:'marmot' }, { w:'ANFIBIO', m:'amphibian' }, { w:'AXOLOTE', m:'axolotl' },
    { w:'ESPONJA', m:'sponge' }, { w:'PERCEBE', m:'goose barnacle' }, { w:'LENTEJA', m:'lentil' },
    { w:'PEREJIL', m:'parsley' }, { w:'ORÉGANO', m:'oregano' }, { w:'BRÓCOLI', m:'broccoli' },
    { w:'GIRASOL', m:'sunflower' }, { w:'TULIPÁN', m:'tulip' }, { w:'AMAPOLA', m:'poppy' },
    { w:'VIOLETA', m:'violet' }, { w:'GERANIO', m:'geranium' }, { w:'BEGONIA', m:'begonia' },
    { w:'NARCISO', m:'daffodil' }, { w:'JACINTO', m:'hyacinth' }, { w:'PRÍMULA', m:'primrose' },
    { w:'HELECHO', m:'fern' }, { w:'PALMERA', m:'palm tree' }, { w:'SECUOYA', m:'sequoia' },
    { w:'DURAZNO', m:'peach' }, { w:'MANZANA', m:'apple' }, { w:'GRANADA', m:'pomegranate' },
    { w:'CEVICHE', m:'ceviche' }, { w:'PUCHERO', m:'stew' }, { w:'CAZUELA', m:'casserole' },
    { w:'CHORIZO', m:'chorizo sausage' }, { w:'CHULETA', m:'chop; cutlet' }, { w:'PECHUGA', m:'chicken breast' },
    { w:'PLANCHA', m:'clothes iron' }, { w:'COSTURA', m:'sewing' }, { w:'ALFILER', m:'pin' },
    { w:'VESTIDO', m:'dress' }, { w:'CORBATA', m:'necktie' }, { w:'PAÑUELO', m:'handkerchief' },
    { w:'BUFANDA', m:'scarf' }, { w:'PULSERA', m:'bracelet' }, { w:'SORTIJA', m:'ring' },
    { w:'CANASTA', m:'basket' }, { w:'PAQUETE', m:'package' }, { w:'BISAGRA', m:'hinge' },
    { w:'TARJETA', m:'card' }, { w:'TECLADO', m:'keyboard' }, { w:'ARCHIVO', m:'file' },
    { w:'COMEDOR', m:'dining room' }, { w:'PASILLO', m:'hallway' }, { w:'ALACENA', m:'pantry' },
    { w:'MANSIÓN', m:'mansion' }, { w:'COCHERA', m:'garage' }, { w:'REFUGIO', m:'shelter' },
    { w:'LITORAL', m:'coastline' }, { w:'CASCADA', m:'waterfall' },
    { w:'GLACIAR', m:'glacier' }, { w:'ALCALDE', m:'mayor' }, { w:'SENADOR', m:'senator' },
    { w:'ARTISTA', m:'artist' }, { w:'MODISTA', m:'dressmaker' }, { w:'PLOMERO', m:'plumber' },
    { w:'VAQUERO', m:'cowboy' }, { w:'TEJEDOR', m:'weaver' }, { w:'ORFEBRE', m:'goldsmith' },
    { w:'TURISTA', m:'tourist' }, { w:'PERSONA', m:'person' }, { w:'CORAZÓN', m:'heart' },
    { w:'CEREBRO', m:'brain' }, { w:'MÚSCULO', m:'muscle' }, { w:'RODILLA', m:'knee' },
    { w:'ESPALDA', m:'back' }, { w:'SONRISA', m:'smile' }, { w:'LÁGRIMA', m:'tear' },
    { w:'MENTIRA', m:'lie' }, { w:'SECRETO', m:'secret' },
    { w:'EMOCIÓN', m:'emotion' }, { w:'PELIGRO', m:'danger' }, { w:'TRABAJO', m:'work' },
    { w:'SALARIO', m:'salary' }, { w:'BATALLA', m:'battle' }, { w:'TRIUNFO', m:'triumph' },
    { w:'FRACASO', m:'failure' }, { w:'DEPORTE', m:'sport' }, { w:'CARRERA', m:'race; career' },
    { w:'LEYENDA', m:'legend' },
    { w:'GAVILÁN', m:'hawk' }, { w:'TÓRTOLA', m:'turtledove' }, { w:'VENCEJO', m:'swift (bird)' },
    { w:'CORNEJA', m:'crow' }, { w:'INSECTO', m:'insect' }, { w:'ZANCUDO', m:'mosquito (LatAm)' },
    { w:'NAUTILO', m:'nautilus' }, { w:'MARRAJO', m:'mako shark' }, { w:'CORVINA', m:'corvina (fish)' },
    { w:'LAMPREA', m:'lamprey' }, { w:'CONGRIO', m:'conger eel' }, { w:'ABADEJO', m:'pollack; saithe' },
    { w:'BOCARTE', m:'anchovy' }, { w:'PIRAGUA', m:'canoe' }, { w:'BARCAZA', m:'barge' },
    { w:'CRUCERO', m:'cruise ship' }, { w:'TORPEDO', m:'torpedo' }, { w:'TRÁILER', m:'trailer; truck' },
    { w:'ROTONDA', m:'roundabout' }, { w:'CALZADA', m:'roadway' }, { w:'ASFALTO', m:'asphalt' },
    { w:'ADOQUÍN', m:'cobblestone' }, { w:'MEANDRO', m:'meander' }, { w:'ABOGADO', m:'lawyer' },
    { w:'NOTARIO', m:'notary' }, { w:'FRUTERO', m:'fruit seller' }, { w:'LECHERO', m:'milkman' },
    { w:'AZAFATA', m:'flight attendant' }, { w:'CORONEL', m:'colonel' }, { w:'OFICIAL', m:'officer' },
    { w:'RECLUTA', m:'recruit' }, { w:'CANTERO', m:'stonemason' }, { w:'TORNERO', m:'lathe operator' },
    { w:'LIBRERO', m:'bookseller' }, { w:'PORTERO', m:'doorman; goalkeeper' },
    { w:'PESTAÑA', m:'eyelash' }, { w:'PÁRPADO', m:'eyelid' }, { w:'PALADAR', m:'palate' },
    { w:'VIENTRE', m:'belly' }, { w:'CINTURA', m:'waist' }, { w:'OMBLIGO', m:'navel' },
    { w:'TOBILLO', m:'ankle' }, { w:'EMPEINE', m:'instep' }, { w:'ARTERIA', m:'artery' },
    { w:'TRÁQUEA', m:'trachea; windpipe' }, { w:'ESÓFAGO', m:'esophagus' }, { w:'NEURONA', m:'neuron' },
    { w:'HORMONA', m:'hormone' }, { w:'MAXILAR', m:'jaw' }, { w:'CARIDAD', m:'charity' },
    { w:'LEALTAD', m:'loyalty' }, { w:'CASTIGO', m:'punishment' }, { w:'DEFECTO', m:'flaw; defect' },
    { w:'APTITUD', m:'aptitude' }, { w:'ACTITUD', m:'attitude' }, { w:'RETRASO', m:'delay' },
    { w:'MADUREZ', m:'maturity' }, { w:'FUNERAL', m:'funeral' }, { w:'CADÁVER', m:'corpse' },
    { w:'DEMONIO', m:'demon' }, { w:'PARAÍSO', m:'paradise' }, { w:'MILAGRO', m:'miracle' },
    { w:'FORTUNA', m:'fortune; luck' }, { w:'RIQUEZA', m:'wealth' }, { w:'POBREZA', m:'poverty' },
    { w:'ORACIÓN', m:'prayer' }, { w:'SÚPLICA', m:'plea' }, { w:'PÚLPITO', m:'pulpit' },
    { w:'ROSARIO', m:'rosary' }, { w:'ROMERÍA', m:'pilgrimage' }, { w:'DESFILE', m:'parade' },
    { w:'COMEDIA', m:'comedy' }, { w:'DISFRAZ', m:'costume' }, { w:'MÁSCARA', m:'mask' },
    { w:'ANTIFAZ', m:'domino mask' }, { w:'ADIVINO', m:'fortune teller' }, { w:'PROFETA', m:'prophet' },
    { w:'ORÁCULO', m:'oracle' }, { w:'AUGURIO', m:'omen' }, { w:'SÍMBOLO', m:'symbol' },
    { w:'EMBLEMA', m:'emblem' }, { w:'DIPLOMA', m:'diploma' }, { w:'PÁRRAFO', m:'paragraph' },
    { w:'VOLUMEN', m:'volume' }, { w:'EDICIÓN', m:'edition' }, { w:'ESCRITO', m:'written text' },
    { w:'TROMBÓN', m:'trombone' }, { w:'SAXOFÓN', m:'saxophone' }, { w:'PANDERO', m:'tambourine' },
    { w:'MELODÍA', m:'melody' }, { w:'ARMONÍA', m:'harmony' }, { w:'CANCIÓN', m:'song' },
    { w:'ROMANCE', m:'ballad' }, { w:'ESTROFA', m:'stanza' }, { w:'SOLISTA', m:'soloist' },
    { w:'CORISTA', m:'chorus singer' }, { w:'SEXTETO', m:'sextet' }, { w:'RECITAL', m:'recital' },
    { w:'APLAUSO', m:'applause' },
    { w:'CHARRÁN', m:'tern (bird)' }, { w:'AUTILLO', m:'scops owl' }, { w:'TUÁTARA', m:'tuatara' },
    { w:'EFÍMERA', m:'mayfly' }, { w:'BIVALVO', m:'bivalve' }, { w:'PEÑASCO', m:'crag; boulder' },
    { w:'COLLADO', m:'mountain pass' }, { w:'MARISMA', m:'salt marsh' }, { w:'CIÉNAGA', m:'swamp' },
    { w:'PANTANO', m:'swamp; marsh' }, { w:'REMANSO', m:'backwater' }, { w:'GRANIZO', m:'hail' },
    { w:'DILUVIO', m:'downpour' }, { w:'NEBLINA', m:'mist' }, { w:'ECLIPSE', m:'eclipse' },
    { w:'METEORO', m:'meteor' }, { w:'ENDRINO', m:'blackthorn' }, { w:'PALMITO', m:'palmetto; heart of palm' },
    { w:'SAGUARO', m:'saguaro cactus' }, { w:'AZUCENA', m:'white lily' }, { w:'CHOPERA', m:'poplar grove' },
    { w:'PAPRIKA', m:'paprika' }, { w:'CHALOTA', m:'shallot' }, { w:'REPOLLO', m:'cabbage' },
    { w:'MARAÑÓN', m:'cashew' }, { w:'GUISADO', m:'stew' }, { w:'FRITURA', m:'fried food' },
    { w:'TORTITA', m:'pancake' }, { w:'CANELÓN', m:'cannelloni' }, { w:'TORRIJA', m:'French toast' },
    { w:'BUÑUELO', m:'fritter' }, { w:'ALMÍBAR', m:'syrup' }, { w:'MAZAPÁN', m:'marzipan' },
    { w:'ALFAJOR', m:'alfajor cookie' }, { w:'PANCETA', m:'bacon' }, { w:'MANTECA', m:'lard' },
    { w:'GINEBRA', m:'gin' }, { w:'TEQUILA', m:'tequila' }, { w:'CHAMPÁN', m:'champagne' },
    { w:'SANGRÍA', m:'sangria' }, { w:'FRAZADA', m:'blanket (LatAm)' }, { w:'BANDEJA', m:'tray' },
    { w:'CHÁNDAL', m:'tracksuit' }, { w:'HEBILLA', m:'buckle' }, { w:'BORDADO', m:'embroidery' },
    { w:'ALICATE', m:'pliers' }, { w:'ESCOPLO', m:'chisel' }, { w:'PALANCA', m:'lever' },
    { w:'SOPORTE', m:'support' }, { w:'ANDAMIO', m:'scaffold' }, { w:'PELDAÑO', m:'step (of stairs)' },
    { w:'COLUMNA', m:'column' }, { w:'REMACHE', m:'rivet' },
    { w:'CERROJO', m:'bolt lock' }, { w:'ESLABÓN', m:'link (of chain)' }, { w:'REJILLA', m:'grate; grille' },
    { w:'CANCELA', m:'gate' }, { w:'GALERÍA', m:'gallery' }, { w:'MIRADOR', m:'viewpoint' },
    { w:'LETRINA', m:'latrine' }, { w:'TENDERO', m:'clothesline' }, { w:'ESTUCHE', m:'case; box' },
    { w:'JUZGADO', m:'courthouse' }, { w:'CLÍNICA', m:'clinic' }, { w:'COLMADO', m:'grocery store' },
    { w:'INFANTE', m:'prince (Spain); infantryman' }, { w:'BRIGADA', m:'brigade' }, { w:'MILITAR', m:'military (person)' },
    { w:'MORTERO', m:'mortar' }, { w:'MONARCA', m:'monarch' }, { w:'INFANTA', m:'princess (Spain)' },
    { w:'MARQUÉS', m:'marquis' }, { w:'SEÑORÍO', m:'lordship' }, { w:'VASALLO', m:'vassal' },
    { w:'ESCLAVO', m:'slave' }, { w:'PLEBEYO', m:'plebeian' }, { w:'ALCÁZAR', m:'fortress; citadel' },
    { w:'BASTIÓN', m:'bastion' }, { w:'ARANCEL', m:'tariff' }, { w:'TRIBUTO', m:'tribute' },
    { w:'OFRENDA', m:'offering' }, { w:'LIMOSNA', m:'alms' }, { w:'CEMENTO', m:'cement' },
    { w:'CRISTAL', m:'glass' }, { w:'ARCILLA', m:'clay' }, { w:'AZULEJO', m:'tile' },
    { w:'MOSAICO', m:'mosaic' }, { w:'PIZARRA', m:'slate; chalkboard' }, { w:'GRANITO', m:'granite' },
    { w:'CANTERA', m:'quarry' }, { w:'ALCOHOL', m:'alcohol' }, { w:'ALMACÉN', m:'warehouse' },
    { w:'VIGILIA', m:'eve; vigil' }, { w:'MEDALLA', m:'medal' }, { w:'OVACIÓN', m:'ovation' },
    { w:'BACHATA', m:'bachata (dance)' }, { w:'CAPITAL', m:'capital (city; funds)' }, { w:'PÉRDIDA', m:'loss' },
    { w:'CRÉDITO', m:'credit' },
    { w:'MANDRIL', m:'mandrill' }, { w:'CARACAL', m:'caracal (wild cat)' }, { w:'AVEFRÍA', m:'lapwing' },
    { w:'GORGOJO', m:'weevil' }, { w:'BIÓLOGO', m:'biologist' }, { w:'GEÓLOGO', m:'geologist' },
    { w:'ZOÓLOGO', m:'zoologist' }, { w:'BOMBERO', m:'firefighter' }, { w:'GUARDIA', m:'guard' },
    { w:'CELADOR', m:'caretaker; warden' }, { w:'ARRIERO', m:'muleteer' }, { w:'COCHERO', m:'coachman' },
    { w:'PICADOR', m:'picador (bullfighting)' }, { w:'MATADOR', m:'bullfighter' }, { w:'NADADOR', m:'swimmer' },
    { w:'CAPATAZ', m:'foreman' }, { w:'GRUMETE', m:'cabin boy' }, { w:'TIMONEL', m:'helmsman' },
    { w:'PÁRROCO', m:'parish priest' }, { w:'ACÓLITO', m:'altar boy' }, { w:'EREMITA', m:'hermit' },
    { w:'ABADESA', m:'abbess' }, { w:'NOVICIO', m:'novice' }, { w:'CLÉRIGO', m:'clergyman' },
    { w:'POETISA', m:'poetess' }, { w:'PATILLA', m:'sideburn' }, { w:'PERILLA', m:'goatee' },
    { w:'MORATÓN', m:'bruise' }, { w:'VERRUGA', m:'wart' }, { w:'BRAVURA', m:'bravery' },
    { w:'CAUTELA', m:'caution' }, { w:'CUIDADO', m:'care' }, { w:'DESMAYO', m:'faint' },
    { w:'VENTAJA', m:'advantage' }, { w:'BARRERA', m:'barrier' }, { w:'ESTORBO', m:'hindrance' },
    { w:'ASOMBRO', m:'astonishment' }, { w:'ESTUPOR', m:'stupor' }, { w:'RESPETO', m:'respect' },
    { w:'SONROJO', m:'blush' }, { w:'VANIDAD', m:'vanity' }, { w:'TIMIDEZ', m:'shyness' },
    { w:'CERTEZA', m:'certainty' }, { w:'INDULTO', m:'pardon' }, { w:'LÁSTIMA', m:'pity' },
    { w:'SOLEDAD', m:'loneliness' }, { w:'DESAMOR', m:'loss of love' }, { w:'AUXILIO', m:'help' },
    { w:'SOCORRO', m:'rescue' }, { w:'DEFENSA', m:'defense' }, { w:'INSULTO', m:'insult' },
    { w:'AFRENTA', m:'affront' }, { w:'ULTRAJE', m:'outrage' }, { w:'INJURIA', m:'slander' },
    { w:'LITIGIO', m:'lawsuit' }, { w:'DEMANDA', m:'lawsuit; demand' }, { w:'ACUSADO', m:'defendant' },
    { w:'CONDENA', m:'sentence; condemnation' }, { w:'RECLUSO', m:'inmate' }, { w:'ALCAIDE', m:'prison warden' },
    { w:'VERDUGO', m:'executioner' }, { w:'VOCABLO', m:'word' }, { w:'CRÓNICA', m:'chronicle' },
    { w:'HORARIO', m:'schedule' }, { w:'PERIPLO', m:'voyage' }, { w:'COMBATE', m:'combat' },
    { w:'PUPITRE', m:'school desk' }, { w:'CARTERA', m:'wallet; briefcase' }, { w:'MOCHILA', m:'backpack' },
    { w:'CARPETA', m:'folder' }, { w:'FOLLETO', m:'booklet' }, { w:'REVISTA', m:'magazine' },
    { w:'BOLETÍN', m:'bulletin' }, { w:'USUARIO', m:'user' }, { w:'ACUERDO', m:'agreement' },
    { w:'TRATADO', m:'treaty' }, { w:'TALADRO', m:'drill' }, { w:'BARRENA', m:'gimlet; auger' },
    { w:'BISTURÍ', m:'scalpel' }, { w:'RODILLO', m:'roller' }, { w:'VELADOR', m:'nightstand' },
    { w:'VITRINA', m:'display case' }, { w:'CAMILLA', m:'stretcher' }, { w:'VENDAJE', m:'bandage' },
    { w:'JERINGA', m:'syringe' }, { w:'CÁPSULA', m:'capsule' }, { w:'ALAMBRE', m:'wire' },
    { w:'TIRANTE', m:'strap; brace' }, { w:'PEINETA', m:'decorative comb' }, { w:'CHALECO', m:'vest' },
    { w:'ARSENAL', m:'arsenal' }, { w:'FUSIBLE', m:'fuse' }, { w:'PENACHO', m:'plume' },
    { w:'BANDERA', m:'flag' }, { w:'GARRIGA', m:'scrubland' }, { w:'ENCINAR', m:'holm oak grove' },
    { w:'SAUCEDA', m:'willow grove' }, { w:'ESPINAR', m:'thorn thicket' }, { w:'NUBLADO', m:'cloudy sky' },
    { w:'ESTRENO', m:'premiere' }
  ],
  8: [
    { w:'AGUACATE', m:'avocado' }, { w:'CALABAZA', m:'pumpkin; squash' },
    { w:'ESPINACA', m:'spinach' }, { w:'PIMIENTO', m:'bell pepper' }, { w:'MARACUYÁ', m:'passion fruit' },
    { w:'LIMONADA', m:'lemonade' }, { w:'REFRESCO', m:'soft drink' }, { w:'ENSALADA', m:'salad' },
    { w:'TORTILLA', m:'tortilla; Spanish omelet' }, { w:'ALMUERZO', m:'lunch' }, { w:'DESAYUNO', m:'breakfast' },
    { w:'CARAMELO', m:'candy' }, { w:'ESPÁTULA', m:'spatula' }, { w:'CHAMPAÑA', m:'champagne' },
    { w:'ALMOHADA', m:'pillow' }, { w:'ESCALERA', m:'staircase; ladder' }, { w:'ASCENSOR', m:'elevator' },
    { w:'ALFOMBRA', m:'carpet; rug' }, { w:'BOMBILLA', m:'light bulb' }, { w:'LAVADORA', m:'washing machine' },
    { w:'CAFETERA', m:'coffee maker' }, { w:'CHIMENEA', m:'chimney' }, { w:'EDIFICIO', m:'building' },
    { w:'CATEDRAL', m:'cathedral' }, { w:'TRIBUNAL', m:'courthouse' }, { w:'PRÍNCIPE', m:'prince' },
    { w:'PRINCESA', m:'princess' }, { w:'ARMADURA', m:'armor' }, { w:'MARTILLO', m:'hammer' },
    { w:'TORNILLO', m:'screw' }, { w:'DENTISTA', m:'dentist' }, { w:'CIRUJANO', m:'surgeon' },
    { w:'MARINERO', m:'sailor' }, { w:'PANADERO', m:'baker' }, { w:'COCINERO', m:'cook; chef' },
    { w:'CANTANTE', m:'singer' }, { w:'ESCRITOR', m:'writer' }, { w:'PROFESOR', m:'professor; teacher' },
    { w:'HISTORIA', m:'history; story' }, { w:'MEDICINA', m:'medicine' }, { w:'TELÉFONO', m:'telephone' },
    { w:'PELÍCULA', m:'movie; film' }, { w:'TORMENTA', m:'storm' }, { w:'ESTRELLA', m:'star' },
    { w:'ARCOÍRIS', m:'rainbow' }, { w:'SOMBRERO', m:'hat' }, { w:'CHAQUETA', m:'jacket' },
    { w:'PANTALÓN', m:'trousers; pants' }, { w:'MARIPOSA', m:'butterfly' },
    { w:'GUISANTE', m:'pea' }, { w:'GARBANZO', m:'chickpea' }, { w:'ALMENDRA', m:'almond' },
    { w:'AVELLANA', m:'hazelnut' }, { w:'PISTACHO', m:'pistachio' }, { w:'GROSELLA', m:'currant' },
    { w:'GAZPACHO', m:'gazpacho' }, { w:'MERIENDA', m:'afternoon snack' }, { w:'GOLOSINA', m:'sweet treat' },
    { w:'BIZCOCHO', m:'sponge cake' }, { w:'PARRILLA', m:'grill; barbecue' }, { w:'ALQUILER', m:'rent' },
    { w:'PERCHERO', m:'coat rack' }, { w:'SECADORA', m:'(clothes) dryer' }, { w:'BATIDORA', m:'blender; mixer' },
    { w:'HERVIDOR', m:'kettle' }, { w:'CISTERNA', m:'cistern; tank' }, { w:'CONVENTO', m:'convent' },
    { w:'BASÍLICA', m:'basilica' }, { w:'CHANTAJE', m:'blackmail' }, { w:'CULPABLE', m:'culprit' },
    { w:'INOCENTE', m:'innocent person' }, { w:'GRILLETE', m:'shackle' }, { w:'DENUNCIA', m:'(formal) complaint' },
    { w:'COARTADA', m:'alibi' }, { w:'ESCOPETA', m:'shotgun' }, { w:'REVÓLVER', m:'revolver' },
    { w:'DONCELLA', m:'maiden' }, { w:'ESCUDERO', m:'squire' }, { w:'FARMACIA', m:'pharmacy' },
    { w:'PESCADOR', m:'fisherman' }, { w:'ZAPATERO', m:'shoemaker' }, { w:'RELOJERO', m:'watchmaker' },
    { w:'ESCULTOR', m:'sculptor' }, { w:'BAILARÍN', m:'dancer' }, { w:'DIRECTOR', m:'director' },
    { w:'EMPLEADO', m:'employee' }, { w:'APRENDIZ', m:'apprentice' }, { w:'MAESTRÍA', m:"master's degree" },
    { w:'FACULTAD', m:'faculty; department' }, { w:'BIOLOGÍA', m:'biology' }, { w:'GEOLOGÍA', m:'geology' },
    { w:'ZOOLOGÍA', m:'zoology' }, { w:'BOTÁNICA', m:'botany' }, { w:'VITAMINA', m:'vitamin' },
    { w:'PROTEÍNA', m:'protein' }, { w:'MAGNESIO', m:'magnesium' }, { w:'MOLÉCULA', m:'molecule' },
    { w:'ELECTRÓN', m:'electron' }, { w:'POTENCIA', m:'power' },
    { w:'PELÍCANO', m:'pelican' }, { w:'CORMORÁN', m:'cormorant' }, { w:'ABEJORRO', m:'bumblebee' },
    { w:'LIBÉLULA', m:'dragonfly' }, { w:'COLMILLO', m:'fang; tusk' }, { w:'LEOPARDO', m:'leopard' },
    { w:'GUEPARDO', m:'cheetah' }, { w:'AVESTRUZ', m:'ostrich' }, { w:'CODORNIZ', m:'quail' },
    { w:'ALCATRAZ', m:'gannet' }, { w:'ALBATROS', m:'albatross' }, { w:'MAREMOTO', m:'seaquake; tsunami' },
    { w:'ESCARCHA', m:'frost' }, { w:'VENDAVAL', m:'gale' }, { w:'AMANECER', m:'dawn; daybreak' },
    { w:'UNIVERSO', m:'universe' }, { w:'NEBULOSA', m:'nebula' }, { w:'GRAVEDAD', m:'gravity' },
    { w:'SATÉLITE', m:'satellite' }, { w:'ARBOLEDA', m:'grove' }, { w:'VENDIMIA', m:'grape harvest' },
    { w:'LEVADURA', m:'yeast' }, { w:'CALCETÍN', m:'sock' }, { w:'SANDALIA', m:'sandal' },
    { w:'BOLSILLO', m:'pocket' }, { w:'CINTURÓN', m:'belt' }, { w:'PAÑOLETE', m:'handkerchief' },
    { w:'DELANTAL', m:'apron' }, { w:'UNIFORME', m:'uniform' }, { w:'CUCHILLA', m:'blade' },
    { w:'ACUARELA', m:'watercolor' }, { w:'MARCADOR', m:'marker; scoreboard' }, { w:'BORRADOR', m:'eraser; draft' },
    { w:'JABONERA', m:'soap dish' }, { w:'TOALLERO', m:'towel rack' }, { w:'TRASTERO', m:'storeroom' },
    { w:'CONSERJE', m:'building caretaker' }, { w:'VECINDAD', m:'neighborhood' }, { w:'HIPOTECA', m:'mortgage' },
    { w:'CORREDOR', m:'corridor' }, { w:'PORTERÍA', m:'gatehouse; lobby' }, { w:'GLORIETA', m:'roundabout; gazebo' },
    { w:'BARRIADA', m:'district; slum' }, { w:'HACIENDA', m:'estate; ranch' }, { w:'ESTANCIA', m:'stay; ranch' },
    { w:'GOBIERNO', m:'government' }, { w:'DISTRITO', m:'district' }, { w:'TRAYECTO', m:'route; journey' },
    { w:'PARAGUAS', m:'umbrella' }, { w:'LINTERNA', m:'flashlight' }, { w:'CARGUERO', m:'cargo ship' },
    { w:'CUBIERTA', m:'deck; cover' }, { w:'BUCEADOR', m:'diver' }, { w:'PATINETE', m:'scooter' },
    { w:'GASOLINA', m:'gasoline' }, { w:'SEMÁFORO', m:'traffic light' }, { w:'PASAJERO', m:'passenger' },
    { w:'AVENTURA', m:'adventure' }, { w:'EQUIPAJE', m:'luggage' }, { w:'CICLISTA', m:'cyclist' },
    { w:'REMOLQUE', m:'trailer; tow' }, { w:'ESTACIÓN', m:'station' }, { w:'GIMNASIO', m:'gym' },
    { w:'VOLEIBOL', m:'volleyball' }, { w:'NATACIÓN', m:'swimming' }, { w:'CICLISMO', m:'cycling' },
    { w:'ORQUESTA', m:'orchestra' }, { w:'CONJUNTO', m:'ensemble; set' }, { w:'BARÍTONO', m:'baritone' },
    { w:'GRADERÍA', m:'stands; bleachers' }, { w:'CAMISETA', m:'jersey; T-shirt' }, { w:'BANDERÍN', m:'pennant' },
    { w:'TRAGALUZ', m:'skylight' }, { w:'TRAVESÍA', m:'crossing; voyage' }, { w:'ALBORADA', m:'dawn (poetic)' },
    { w:'APERTURA', m:'opening' }, { w:'LIMPIEZA', m:'cleanliness' }, { w:'SUCIEDAD', m:'dirtiness' },
    { w:'ANSIEDAD', m:'anxiety' }, { w:'VARIEDAD', m:'variety' }, { w:'CUALIDAD', m:'quality; trait' },
    { w:'CRUELDAD', m:'cruelty' }, { w:'SANTIDAD', m:'holiness' }, { w:'HUMILDAD', m:'humility' },
    { w:'LIBERTAD', m:'freedom' }, { w:'JUVENTUD', m:'youth' }, { w:'ECONOMÍA', m:'economy' },
    { w:'ANATOMÍA', m:'anatomy' }, { w:'ACADEMIA', m:'academy' }, { w:'SOCIEDAD', m:'society' },
    { w:'AMARGURA', m:'bitterness' }, { w:'LENTITUD', m:'slowness' }, { w:'FALSIDAD', m:'falseness' },
    { w:'QUINCENA', m:'fortnight' }, { w:'ALIMENTO', m:'food' }, { w:'MISTERIO', m:'mystery' },
    { w:'SILENCIO', m:'silence' }, { w:'AUSENCIA', m:'absence' }, { w:'PREGUNTA', m:'question' },
    { w:'PETICIÓN', m:'request' },
    { w:'LENGUADO', m:'sole (fish)' }, { w:'LANGOSTA', m:'lobster' }, { w:'CANGREJO', m:'crab' },
    { w:'COLIFLOR', m:'cauliflower' }, { w:'HOJALDRE', m:'puff pastry' }, { w:'HORCHATA', m:'horchata' },
    { w:'ESTOFADO', m:'stew' }, { w:'EMPANADA', m:'empanada; turnover' }, { w:'ALBAHACA', m:'basil' },
    { w:'JENGIBRE', m:'ginger' }, { w:'TABURETE', m:'stool' }, { w:'RALLADOR', m:'grater' },
    { w:'MANGUERA', m:'hose' }, { w:'HOSPITAL', m:'hospital' }, { w:'VIADUCTO', m:'viaduct' },
    { w:'DESPACHO', m:'office; study' }, { w:'EMBAJADA', m:'embassy' }, { w:'CLAUSTRO', m:'cloister' },
    { w:'LADRILLO', m:'brick' }, { w:'DIPUTADO', m:'deputy; congressman' }, { w:'MINISTRO', m:'minister' },
    { w:'ELECCIÓN', m:'election' }, { w:'FRONTERA', m:'border' }, { w:'FORAJIDO', m:'outlaw' },
    { w:'CORSARIO', m:'corsair; privateer' }, { w:'CONTRATO', m:'contract' }, { w:'HERENCIA', m:'inheritance' },
    { w:'FISCALÍA', m:"prosecutor's office" }, { w:'PIANISTA', m:'pianist' }, { w:'GUITARRA', m:'guitar' },
    { w:'TROMPETA', m:'trumpet' }, { w:'ACORDEÓN', m:'accordion' }, { w:'SINFONÍA', m:'symphony' },
    { w:'TRAGEDIA', m:'tragedy' }, { w:'TRAPECIO', m:'trapeze' }, { w:'VENTISCA', m:'snowstorm' },
    { w:'AGUACERO', m:'downpour' }, { w:'CHUBASCO', m:'heavy shower' }, { w:'DERRUMBE', m:'landslide; collapse' },
    { w:'ARRECIFE', m:'reef' }, { w:'REMOLINO', m:'whirlpool; whirlwind' }, { w:'ELEFANTE', m:'elephant' },
    { w:'ANACONDA', m:'anaconda' }, { w:'CAMALEÓN', m:'chameleon' }, { w:'FLAMENCO', m:'flamingo' },
    { w:'ANTÍLOPE', m:'antelope' }, { w:'MOSQUITO', m:'mosquito' }, { w:'VERTEBRA', m:'vertebra' },
    { w:'GARGANTA', m:'throat' }, { w:'ESTÓMAGO', m:'stomach' }, { w:'CICATRIZ', m:'scar' },
    { w:'NEUMONÍA', m:'pneumonia' }, { w:'MALESTAR', m:'malaise; discomfort' }, { w:'PASTILLA', m:'pill' },
    { w:'PACIENTE', m:'patient' }, { w:'TRISTEZA', m:'sadness' }, { w:'DIGNIDAD', m:'dignity' },
    { w:'HONRADEZ', m:'honesty' }, { w:'TRAICIÓN', m:'betrayal' }, { w:'GALARDÓN', m:'award; prize' },
    { w:'VICTORIA', m:'victory' }, { w:'ESFUERZO', m:'effort' }, { w:'RECUERDO', m:'memory; keepsake' },
    { w:'FRACCIÓN', m:'fraction' }, { w:'ECUACIÓN', m:'equation' }, { w:'VARIABLE', m:'variable' },
    { w:'LONGITUD', m:'length' }, { w:'MAGNITUD', m:'magnitude' }, { w:'DENSIDAD', m:'density' },
    { w:'MERCURIO', m:'mercury' }, { w:'ALUMINIO', m:'aluminum' }, { w:'INVIERNO', m:'winter' },
    { w:'MEDIODÍA', m:'noon' }, { w:'INSTANTE', m:'instant; moment' }, { w:'INFANCIA', m:'childhood' },
    { w:'JUBILADO', m:'retiree' }, { w:'NOVIAZGO', m:'courtship; dating' }, { w:'PARIENTE', m:'relative' },
    { w:'CUADERNO', m:'notebook' }, { w:'CAPÍTULO', m:'chapter' }, { w:'ALFABETO', m:'alphabet' },
    { w:'LENGUAJE', m:'language' }, { w:'SINÓNIMO', m:'synonym' }, { w:'ANTÓNIMO', m:'antonym' },
    { w:'SEMESTRE', m:'semester' }, { w:'IMPUESTO', m:'tax' }, { w:'PRÉSTAMO', m:'loan' },
    { w:'BANQUERO', m:'banker' }, { w:'GANANCIA', m:'profit; gain' }, { w:'COMPAÑÍA', m:'company' },
    { w:'COMERCIO', m:'commerce; trade' }, { w:'ETIQUETA', m:'label; tag' }, { w:'BUSCADOR', m:'search engine' },
    { w:'PORTÁTIL', m:'laptop' }, { w:'PANTALLA', m:'screen' }, { w:'PROGRAMA', m:'program; TV show' },
    { w:'JABALINA', m:'javelin' }, { w:'TRIATLÓN', m:'triathlon' }, { w:'ESCALADA', m:'climbing' },
    { w:'AERONAVE', m:'aircraft' },
    { w:'MEJILLÓN', m:'mussel' }, { w:'BOQUERÓN', m:'anchovy' }, { w:'CHAPULÍN', m:'grasshopper' },
    { w:'MUSARAÑA', m:'shrew' }, { w:'LLOVIZNA', m:'drizzle' }, { w:'ENSENADA', m:'cove; small bay' },
    { w:'CAMAROTE', m:'(ship) cabin' }, { w:'ESTAMBRE', m:'stamen' }, { w:'REGADERA', m:'watering can' },
    { w:'ASPERSOR', m:'sprinkler' }, { w:'CILANTRO', m:'cilantro; coriander' }, { w:'PIMIENTA', m:'pepper (spice)' },
    { w:'HORMIGÓN', m:'concrete' }, { w:'VIDRIERA', m:'stained-glass window' }, { w:'CARDENAL', m:'cardinal' },
    { w:'COMUNIÓN', m:'communion' }, { w:'FAMILIAR', m:'relative (noun)' }, { w:'CONOCIDO', m:'acquaintance' },
    { w:'LAPICERO', m:'pencil' }, { w:'DIALECTO', m:'dialect' }, { w:'APROBADO', m:'passing grade' },
    { w:'SUSPENSO', m:'failing grade' }, { w:'DISCURSO', m:'speech' }, { w:'ATENCIÓN', m:'attention' },
    { w:'ACREEDOR', m:'creditor' }, { w:'CONTADOR', m:'accountant' }, { w:'PRODUCTO', m:'product' },
    { w:'LOGOTIPO', m:'logo' }, { w:'REDACTOR', m:'editor' }, { w:'IMPRENTA', m:'printing press' },
    { w:'ORIGINAL', m:'original' }, { w:'DIFUSIÓN', m:'broadcast; diffusion' }, { w:'AUDICIÓN', m:'audition' },
    { w:'DECORADO', m:'stage set' }, { w:'DECATLÓN', m:'decathlon' }, { w:'TERMINAL', m:'terminal' },
    { w:'DESPEGUE', m:'takeoff' }, { w:'FUSELAJE', m:'fuselage' }, { w:'PATINAJE', m:'skating' },
    { w:'VOTACIÓN', m:'voting' }, { w:'LICENCIA', m:'license' }, { w:'FALSARIO', m:'forger; counterfeiter' },
    { w:'DETENIDO', m:'detainee' }, { w:'SUCESIÓN', m:'succession' }, { w:'TAMBORIL', m:'small drum' },
    { w:'NARRADOR', m:'narrator' }, { w:'PRESENTE', m:'present; gift' }, { w:'CENTURIA', m:'century' },
    { w:'AMPLITUD', m:'amplitude' }, { w:'PLUTONIO', m:'plutonium' }, { w:'PINGÜINO', m:'penguin' },
    { w:'ZORRILLO', m:'skunk' }, { w:'PEREZOSO', m:'sloth' }, { w:'ORQUÍDEA', m:'orchid' },
    { w:'LIMONERO', m:'lemon tree' }, { w:'MANDIOCA', m:'cassava; yuca' }, { w:'PITAHAYA', m:'dragon fruit' },
    { w:'ARÁNDANO', m:'blueberry' }, { w:'MORCILLA', m:'blood sausage' }, { w:'COSTILLA', m:'rib' },
    { w:'CROQUETA', m:'croquette' }, { w:'ANACARDO', m:'cashew' }, { w:'MACARRÓN', m:'macaroni' },
    { w:'ACEITUNA', m:'olive' }, { w:'REQUESÓN', m:'cottage cheese' }, { w:'MALTEADA', m:'milkshake' },
    { w:'CABECERO', m:'headboard' }, { w:'APARADOR', m:'sideboard' }, { w:'BANQUETA', m:'bench; stool' },
    { w:'MECEDORA', m:'rocking chair' }, { w:'PERSIANA', m:'window blind' }, { w:'DESPENSA', m:'pantry' },
    { w:'ESTANQUE', m:'pond' }, { w:'TENDEDOR', m:'drying rack' }, { w:'COLGADOR', m:'hanger' },
    { w:'CACEROLA', m:'casserole pot' }, { w:'PAELLERA', m:'paella pan' }, { w:'CUCHARÓN', m:'ladle' },
    { w:'CUCHILLO', m:'knife' }, { w:'TOSTADOR', m:'toaster' }, { w:'ESMOQUIN', m:'tuxedo' },
    { w:'CAZADORA', m:'jacket (Spain)' }, { w:'CAMISOLA', m:'nightgown' }, { w:'PANTUFLA', m:'slipper' },
    { w:'ESCARPÍN', m:'bootee; baby shoe' }, { w:'CAPUCHÓN', m:'hood' }, { w:'ZARCILLO', m:'earring' },
    { w:'BARBILLA', m:'chin' }, { w:'DIABETES', m:'diabetes' }, { w:'URGENCIA', m:'emergency' },
    { w:'BOTIQUÍN', m:'first-aid kit' }, { w:'PRÓTESIS', m:'prosthesis' }, { w:'EMBARAZO', m:'pregnancy' },
    { w:'LEBRILLO', m:'basin; washbowl' }, { w:'TOALLITA', m:'(wet) wipe' }, { w:'CAMERINO', m:'dressing room' },
    { w:'TAQUILLA', m:'ticket office; locker' }, { w:'JUGADORA', m:'(female) player' }, { w:'CAMPEONA', m:'(female) champion' },
    { w:'MECÁNICO', m:'mechanic' }, { w:'CAMARERO', m:'waiter' }, { w:'TENIENTE', m:'lieutenant' },
    { w:'SARGENTO', m:'sergeant' }, { w:'GUERRERO', m:'warrior' }, { w:'ALMIRANTE', m:'admiral' },
    { w:'PIZARRÓN', m:'(chalk)board' }, { w:'DEPÓSITO', m:'tank; container' }, { w:'TELARAÑA', m:'spider web' },
    { w:'PLANCTON', m:'plankton' }, { w:'VAINILLA', m:'vanilla' }, { w:'GELATINA', m:'gelatin; jelly' },
    { w:'TIRAMISÚ', m:'tiramisu' }, { w:'MERENGUE', m:'meringue' }, { w:'JALAPEÑO', m:'jalapeño' },
    { w:'REVUELTO', m:'scrambled eggs' }, { w:'SERVICIO', m:'service' }, { w:'MONEDERO', m:'coin purse' },
    { w:'SERRUCHO', m:'saw (tool)' }, { w:'PESTILLO', m:'latch' }, { w:'PLÁSTICO', m:'plastic' },
    { w:'CERÁMICA', m:'ceramics' }, { w:'LIBRERÍA', m:'bookstore' }, { w:'ARTÍCULO', m:'article' },
    { w:'NUBARRÓN', m:'storm cloud' }, { w:'INCENDIO', m:'fire; blaze' }, { w:'BORDILLO', m:'curb' },
    { w:'GUIJARRO', m:'pebble' }, { w:'ARENISCA', m:'sandstone' }, { w:'DIAMANTE', m:'diamond' },
    { w:'TURQUESA', m:'turquoise' }, { w:'AMATISTA', m:'amethyst' }, { w:'CARTUCHO', m:'cartridge' },
    { w:'MUNICIÓN', m:'ammunition' }, { w:'DINAMITA', m:'dynamite' }, { w:'EJÉRCITO', m:'army' },
    { w:'CARABELA', m:'caravel' }, { w:'AVIACIÓN', m:'aviation' }, { w:'COPILOTO', m:'co-pilot' },
    { w:'ROBÓTICA', m:'robotics' }, { w:'MANUBRIO', m:'handlebar' }, { w:'TIROLINA', m:'zipline' },
    { w:'BARRANCO', m:'ravine; gully' }, { w:'SUBURBIO', m:'suburb' }, { w:'INTERIOR', m:'interior' },
    { w:'EXTERIOR', m:'exterior' }, { w:'VERTICAL', m:'vertical' }, { w:'DIAGONAL', m:'diagonal' },
    { w:'PARALELO', m:'parallel' }, { w:'PIRÁMIDE', m:'pyramid' }, { w:'CILINDRO', m:'cylinder' },
    { w:'POLÍGONO', m:'polygon' }, { w:'HEXÁGONO', m:'hexagon' }, { w:'OCTÓGONO', m:'octagon' },
    { w:'DIÁMETRO', m:'diameter' }, { w:'TONELADA', m:'ton' }, { w:'CONSULTA', m:"doctor's visit; consultation" },
    { w:'BACTERIA', m:'bacteria' }, { w:'ESCAYOLA', m:'plaster cast' }, { w:'INSOMNIO', m:'insomnia' },
    { w:'HOSTERÍA', m:'inn' }, { w:'ALBERGUE', m:'hostel; shelter' }, { w:'EBANISTA', m:'cabinetmaker' },
    { w:'ALFARERO', m:'potter' }, { w:'PARPADEO', m:'blink' }, { w:'ACERTIJO', m:'riddle' },
    { w:'SORPRESA', m:'surprise' }, { w:'DIVORCIO', m:'divorce' }, { w:'HUÉRFANO', m:'orphan' },
    { w:'ENTIERRO', m:'burial' }, { w:'SEPULCRO', m:'sepulcher' }, { w:'ESPÍRITU', m:'spirit' },
    { w:'FANTASMA', m:'ghost' }, { w:'VIDENTE', m:'fortune teller' }, { w:'PROFECÍA', m:'prophecy' },
    { w:'PRODIGIO', m:'prodigy; wonder' }, { w:'SEGUIDOR', m:'follower; fan' }, { w:'FANÁTICO', m:'fan; fanatic' },
    { w:'RELIQUIA', m:'relic' }, { w:'FRUTERÍA', m:'fruit shop' }, { w:'GANADERO', m:'cattle rancher' },
    { w:'LABRADOR', m:'farm worker' }, { w:'MOLINERO', m:'miller' }, { w:'VENCEDOR', m:'winner' },
    { w:'PERDEDOR', m:'loser' }, { w:'AGILIDAD', m:'agility' }, { w:'DESTREZA', m:'skill; dexterity' },
    { w:'OPONENTE', m:'opponent' }, { w:'SOLDADOR', m:'welder' }, { w:'EMBRAGUE', m:'clutch (car)' },
    { w:'MALETERO', m:'trunk; boot (car)' }, { w:'CACHAZA', m:'cachaça' }, { w:'DAIQUIRI', m:'daiquiri' },
    { w:'SACIEDAD', m:'satiety' }, { w:'LEGUMBRE', m:'legume' }, { w:'BANQUETE', m:'banquet' },
    { w:'PLATILLO', m:'saucer; dish' }, { w:'ASAMBLEA', m:'assembly' }, { w:'CONGRESO', m:'congress' },
    { w:'ENCUESTA', m:'survey; poll' }
  ],
  13: [
    { w:'INTERNACIONAL', m:'international' }, { w:'TOMACORRIENTE', m:'power outlet; wall socket' }, { w:'INVESTIGACIÓN', m:'investigation; research' },
    { w:'CONSIDERACIÓN', m:'consideration' }, { w:'CONCENTRACIÓN', m:'concentration' }, { w:'JUSTIFICACIÓN', m:'justification' },
    { w:'CUALIFICACIÓN', m:'qualification' }, { w:'CONFRONTACIÓN', m:'confrontation' }, { w:'DESEQUILIBRIO', m:'imbalance' },
    { w:'INDEPENDENCIA', m:'independence' }, { w:'SUPERVIVENCIA', m:'survival' }, { w:'PALEONTOLOGÍA', m:'paleontology' },
    { w:'CERRADURA', m:'lock' }, { w:'SERPIENTE', m:'snake' }, { w:'MARIQUITA', m:'ladybug' },
    { w:'TERREMOTO', m:'earthquake' }, { w:'HORIZONTE', m:'horizon' }, { w:'LABERINTO', m:'labyrinth; maze' },
    { w:'PACIENCIA', m:'patience' }, { w:'PRESENCIA', m:'presence' }, { w:'ELEGANCIA', m:'elegance' },
    { w:'AUDIENCIA', m:'audience' }, { w:'SECUENCIA', m:'sequence' }, { w:'FELICIDAD', m:'happiness' },
    { w:'HUMANIDAD', m:'humanity' }, { w:'FACILIDAD', m:'ease' }, { w:'ACTIVIDAD', m:'activity' },
    { w:'SEGURIDAD', m:'safety; security' }, { w:'ENEMISTAD', m:'enmity' }, { w:'HERMANDAD', m:'brotherhood' },
    { w:'VELOCIDAD', m:'speed' }, { w:'CAPACIDAD', m:'capacity' }, { w:'VERACIDAD', m:'truthfulness' },
    { w:'TENACIDAD', m:'tenacity' }, { w:'FEROCIDAD', m:'ferocity' }, { w:'CIVILIDAD', m:'civility' },
    { w:'HABILIDAD', m:'skill' }, { w:'SABIDURÍA', m:'wisdom' }, { w:'EJERCICIO', m:'exercise' },
    { w:'NUTRICIÓN', m:'nutrition' }, { w:'OPERACIÓN', m:'operation' }, { w:'INYECCIÓN', m:'injection' },
    { w:'ESCARABAJO', m:'beetle' }, { w:'VIGILANCIA', m:'vigilance' }, { w:'AMBULANCIA', m:'ambulance' },
    { w:'DIFERENCIA', m:'difference' }, { w:'REFERENCIA', m:'reference' }, { w:'OBEDIENCIA', m:'obedience' },
    { w:'DECADENCIA', m:'decadence; decline' }, { w:'ELOCUENCIA', m:'eloquence' }, { w:'INFLUENCIA', m:'influence' },
    { w:'EMERGENCIA', m:'emergency' }, { w:'HONESTIDAD', m:'honesty' }, { w:'HOSTILIDAD', m:'hostility' },
    { w:'FERTILIDAD', m:'fertility' }, { w:'FRAGILIDAD', m:'fragility' }, { w:'DIFICULTAD', m:'difficulty' },
    { w:'LONGEVIDAD', m:'longevity' }, { w:'NORMALIDAD', m:'normality' }, { w:'FORMALIDAD', m:'formality' },
    { w:'ANIMOSIDAD', m:'animosity' }, { w:'AMABILIDAD', m:'kindness' }, { w:'ASTRONOMÍA', m:'astronomy' },
    { w:'CORRECCIÓN', m:'correction' }, { w:'PERFECCIÓN', m:'perfection' }, { w:'PROTECCIÓN', m:'protection' },
    { w:'PREVENCIÓN', m:'prevention' }, { w:'EXPERIENCIA', m:'experience' }, { w:'INSEGURIDAD', m:'insecurity' },
    { w:'FRATERNIDAD', m:'fraternity' }, { w:'SOLIDARIDAD', m:'solidarity' }, { w:'ANORMALIDAD', m:'abnormality' },
    { w:'GENEROSIDAD', m:'generosity' }, { w:'CORDIALIDAD', m:'cordiality' }, { w:'CREATIVIDAD', m:'creativity' },
    { w:'COMPRENSIÓN', m:'understanding' }, { w:'COMPOSICIÓN', m:'composition' }, { w:'DISPOSICIÓN', m:'arrangement' },
    { w:'TRANSMISIÓN', m:'transmission' }, { w:'COMPETICIÓN', m:'competition' }, { w:'CONFERENCIA', m:'conference' },
    { w:'PREFERENCIA', m:'preference' }, { w:'CONSECUENCIA', m:'consequence' }, { w:'CONOCIMIENTO', m:'knowledge' },
    { w:'HOSPITALIDAD', m:'hospitality' }, { w:'CRIMINALIDAD', m:'criminality' }, { w:'CONTESTACIÓN', m:'answer; reply' },
    { w:'INTRODUCCIÓN', m:'introduction' }, { w:'REPRODUCCIÓN', m:'reproduction' }, { w:'CONVENIENCIA', m:'convenience' },
    { w:'DEMOSTRACIÓN', m:'demonstration' }, { w:'PRESENTACIÓN', m:'presentation' }, { w:'CONMEMORACIÓN', m:'commemoration' },
    { w:'INTERROGACIÓN', m:'interrogation' }, { w:'IMPROVISACIÓN', m:'improvisation' }, { w:'CONFLAGRACIÓN', m:'conflagration' },
    { w:'INCOMPRENSIÓN', m:'lack of understanding' }, { w:'INCOMPETENCIA', m:'incompetence' }, { w:'CODEPENDENCIA', m:'codependency' },
    { w:'SUBORDINACIÓN', m:'subordination' },
    { w:'AUTORIDAD', m:'authority' }, { w:'BRILLANTE', m:'brilliant; shiny' }, { w:'CABALLERO', m:'gentleman; knight' },
    { w:'CANDIDATO', m:'candidate' }, { w:'CARNÍVORO', m:'carnivore' }, { w:'CATEGORÍA', m:'category' },
    { w:'CENTINELA', m:'sentinel; guard' }, { w:'CEREMONIA', m:'ceremony' }, { w:'CIUDADANO', m:'citizen' },
    { w:'COLECTIVO', m:'collective' }, { w:'COMPAÑERO', m:'companion; classmate' }, { w:'COMPRADOR', m:'buyer' },
    { w:'CONCIERTO', m:'concert' }, { w:'CONFIANZA', m:'confidence; trust' }, { w:'CONQUISTA', m:'conquest' },
    { w:'CONTRASTE', m:'contrast' }, { w:'CURANDERO', m:'healer' }, { w:'DESPEDIDA', m:'farewell' },
    { w:'DICTADURA', m:'dictatorship' }, { w:'DISCOTECA', m:'nightclub' }, { w:'DISTANCIA', m:'distance' },
    { w:'DIVERSIÓN', m:'fun; entertainment' }, { w:'EDUCACIÓN', m:'education' }, { w:'ENSEÑANZA', m:'teaching' },
    { w:'ENVOLTURA', m:'wrapping; packaging' }, { w:'ESCENARIO', m:'stage; scenery' }, { w:'ESCONDITE', m:'hiding place' },
    { w:'EVOLUCIÓN', m:'evolution' }, { w:'FORTALEZA', m:'fortress; strength' }, { w:'FRAGANCIA', m:'fragrance' },
    { w:'GANADERÍA', m:'livestock farming' }, { w:'GUARDERÍA', m:'daycare; nursery' }, { w:'INDUSTRIA', m:'industry' },
    { w:'INFLACIÓN', m:'inflation' }, { w:'INGENIERO', m:'engineer' }, { w:'INSTITUTO', m:'institute' },
    { w:'INVERSIÓN', m:'investment' }, { w:'LIDERAZGO', m:'leadership' }, { w:'MADRUGADA', m:'early morning; dawn' },
    { w:'MANANTIAL', m:'spring (water source)' }, { w:'MANDARINA', m:'tangerine; mandarin' }, { w:'MARAVILLA', m:'marvel; wonder' },
    { w:'MERCANCÍA', m:'merchandise; goods' }, { w:'MONUMENTO', m:'monument' }, { w:'MORALIDAD', m:'morality' },
    { w:'NARRACIÓN', m:'narration; story' }, { w:'NAUFRAGIO', m:'shipwreck' }, { w:'NECESIDAD', m:'necessity; need' },
    { w:'OBSTÁCULO', m:'obstacle' }, { w:'OCUPACIÓN', m:'occupation' }, { w:'ORGANISMO', m:'organism' },
    { w:'ORNAMENTO', m:'ornament; decoration' }, { w:'OSCURIDAD', m:'darkness' }, { w:'PARADIGMA', m:'paradigm' },
    { w:'PENDIENTE', m:'earring' }, { w:'PENÍNSULA', m:'peninsula' }, { w:'PESADILLA', m:'nightmare' },
    { w:'PRESTIGIO', m:'prestige' }, { w:'PRIMAVERA', m:'spring (season)' }, { w:'PRINCIPIO', m:'beginning; principle' },
    { w:'PROFESIÓN', m:'profession' }, { w:'QUIRÓFANO', m:'operating room' }, { w:'REPORTAJE', m:'report; news story' },
    { w:'REQUISITO', m:'requirement' }, { w:'RESULTADO', m:'result' }, { w:'SALVACIÓN', m:'salvation' },
    { w:'SENSACIÓN', m:'sensation; feeling' }, { w:'TEMPORADA', m:'season' }, { w:'TENTACIÓN', m:'temptation' },
    { w:'TENDENCIA', m:'trend' }, { w:'TRIMESTRE', m:'trimester; quarter' }, { w:'TRINCHERA', m:'trench' },
    { w:'VAGABUNDO', m:'vagabond; drifter' }, { w:'VEREDICTO', m:'verdict' }, { w:'VESTÍBULO', m:'lobby; vestibule' },
    { w:'VIGILANTE', m:'watchman; guard' }, { w:'VIOLENCIA', m:'violence' }, { w:'ZANAHORIA', m:'carrot' },
    { w:'ACORAZADO', m:'battleship' }, { w:'ADORACIÓN', m:'adoration; worship' }, { w:'ARTEFACTO', m:'artifact; device' },
    { w:'ARTESANÍA', m:'handicraft' }, { w:'ASISTENTE', m:'assistant' }, { w:'ATRACCIÓN', m:'attraction' },
    { w:'AUTOMÓVIL', m:'automobile' }, { w:'BENDICIÓN', m:'blessing' }, { w:'BICICLETA', m:'bicycle' },
    { w:'BIOGRAFÍA', m:'biography' }, { w:'BISABUELO', m:'great-grandfather' }, { w:'BOCADILLO', m:'sandwich' },
    { w:'BOLÍGRAFO', m:'ballpoint pen' }, { w:'CAFETERÍA', m:'cafeteria; coffee shop' }, { w:'CARRETERA', m:'highway; road' },
    { w:'CATACUMBA', m:'catacomb' }, { w:'COLECCIÓN', m:'collection' }, { w:'COMISARÍA', m:'police station' },
    { w:'CONDUCTOR', m:'driver; conductor' }, { w:'CONFLICTO', m:'conflict' }, { w:'CONFESIÓN', m:'confession' },
    { w:'CONMOCIÓN', m:'commotion; shock' }, { w:'COSTUMBRE', m:'custom; habit' }, { w:'CROMOSOMA', m:'chromosome' },
    { w:'DEBILIDAD', m:'weakness' }, { w:'DEFUNCIÓN', m:'death (formal)' }, { w:'DESEMPLEO', m:'unemployment' },
    { w:'DESGRACIA', m:'misfortune' }, { w:'DETENCIÓN', m:'detention; arrest' }, { w:'DIGESTIÓN', m:'digestion' },
    { w:'DOCUMENTO', m:'document' }, { w:'ENCENDIDO', m:'ignition; lighting' }, { w:'HABITANTE', m:'inhabitant; resident' },
    { w:'HECHICERA', m:'sorceress' }, { w:'HELADERÍA', m:'ice cream shop' }, { w:'HERMOSURA', m:'beauty' },
    { w:'HERRADURA', m:'horseshoe' }, { w:'HOMICIDIO', m:'homicide' }, { w:'IDENTIDAD', m:'identity' },
    { w:'IDEOLOGÍA', m:'ideology' }, { w:'IMITACIÓN', m:'imitation' }, { w:'INDIVIDUO', m:'individual' },
    { w:'INMUNIDAD', m:'immunity' }, { w:'INNOVACIÓN', m:'innovation' }, { w:'INQUILINO', m:'tenant' },
    { w:'INTENCIÓN', m:'intention' }, { w:'INTERVALO', m:'interval' }, { w:'INTIMIDAD', m:'intimacy' },
    { w:'IZQUIERDA', m:'left (side)' }, { w:'KILÓMETRO', m:'kilometer' }, { w:'LAGARTIJA', m:'small lizard' },
    { w:'MANDÍBULA', m:'jaw' }, { w:'MARGARITA', m:'daisy' }, { w:'MASCARADA', m:'masquerade' },
    { w:'MATRÍCULA', m:'registration; enrollment' }, { w:'MAYORDOMO', m:'butler' }, { w:'MERMELADA', m:'jam; marmalade' },
    { w:'METEORITO', m:'meteorite' }, { w:'MICRÓFONO', m:'microphone' }, { w:'MONOPOLIO', m:'monopoly' },
    { w:'MORTADELA', m:'bologna' }, { w:'MOVILIDAD', m:'mobility' }, { w:'NATALICIO', m:'birth (formal)' },
    { w:'ORDENADOR', m:'computer' }, { w:'ORDINARIO', m:'ordinary' }, { w:'PARÁLISIS', m:'paralysis' },
    { w:'PARROQUIA', m:'parish' }, { w:'PARTITURA', m:'sheet music; score' }, { w:'PEGAMENTO', m:'glue; adhesive' },
    { w:'PERIÓDICO', m:'newspaper' }, { w:'PERSONAJE', m:'character' }, { w:'PICAPORTE', m:'door handle; latch' },
    { w:'POLARIDAD', m:'polarity' }, { w:'POSTERIOR', m:'posterior; rear' }, { w:'PROCESIÓN', m:'procession' },
    { w:'PROMOCIÓN', m:'promotion' }, { w:'RAMILLETE', m:'bouquet' },
    { w:'ABUNDANCIA', m:'abundance' }, { w:'AFIRMACIÓN', m:'affirmation; assertion' }, { w:'APARIENCIA', m:'appearance' },
    { w:'APLICACIÓN', m:'application; app' }, { w:'ARQUITECTO', m:'architect' }, { w:'ASOCIACIÓN', m:'association' },
    { w:'ASTRONAUTA', m:'astronaut' }, { w:'ATERRIZAJE', m:'landing' }, { w:'BARANDILLA', m:'railing; banister' },
    { w:'BIBLIOTECA', m:'library' }, { w:'CARICATURA', m:'caricature; cartoon' }, { w:'CARPINTERO', m:'carpenter' },
    { w:'CASTELLANO', m:'Castilian; Spanish' }, { w:'CEMENTERIO', m:'cemetery' }, { w:'CIGARRILLO', m:'cigarette' },
    { w:'COMPROMISO', m:'commitment; compromise' }, { w:'CONDIMENTO', m:'condiment; seasoning' }, { w:'CONTINENTE', m:'continent' },
    { w:'CONTRASEÑA', m:'password' }, { w:'CONVERSIÓN', m:'conversion' }, { w:'CONVICCIÓN', m:'conviction' },
    { w:'CORRUPCIÓN', m:'corruption' }, { w:'CREPÚSCULO', m:'twilight; dusk' }, { w:'CRONÓMETRO', m:'stopwatch; chronometer' },
    { w:'DECORACIÓN', m:'decoration' }, { w:'DEDICACIÓN', m:'dedication' }, { w:'DEMOCRACIA', m:'democracy' },
    { w:'DEPORTISTA', m:'athlete' }, { w:'DETERGENTE', m:'detergent' }, { w:'DESILUSIÓN', m:'disappointment' },
    { w:'DISCIPLINA', m:'discipline' }, { w:'DISTINCIÓN', m:'distinction' }, { w:'DORMITORIO', m:'bedroom' },
    { w:'ESCAPARATE', m:'shop window; display case' }, { w:'ESPECTADOR', m:'spectator' }, { w:'ESTIMACIÓN', m:'estimation' },
    { w:'EXCELENCIA', m:'excellence' }, { w:'EXHIBICIÓN', m:'exhibition' }, { w:'GENERACIÓN', m:'generation' },
    { w:'GRADUACIÓN', m:'graduation' }, { w:'HORMIGUERO', m:'anthill' }, { w:'HOSTELERÍA', m:'hospitality industry' },
    { w:'INDICACIÓN', m:'indication; instruction' }, { w:'INGENIERÍA', m:'engineering' }, { w:'INFRARROJO', m:'infrared' },
    { w:'INSOLACIÓN', m:'sunstroke' }, { w:'INTENSIDAD', m:'intensity' }, { w:'INTÉRPRETE', m:'interpreter' },
    { w:'INVITACIÓN', m:'invitation' }, { w:'IRRIGACIÓN', m:'irrigation' }, { w:'JUBILACIÓN', m:'retirement' },
    { w:'LAVANDERÍA', m:'laundry' }, { w:'LITERATURA', m:'literature' }, { w:'MAQUILLAJE', m:'makeup' },
    { w:'MARQUESINA', m:'bus shelter; canopy' }, { w:'MASCARILLA', m:'face mask' }, { w:'MEDIANOCHE', m:'midnight' },
    { w:'MINISTERIO', m:'ministry' }, { w:'MOVIMIENTO', m:'movement' }, { w:'NATURALEZA', m:'nature' },
    { w:'OBLIGACIÓN', m:'obligation' }, { w:'OBSCENIDAD', m:'obscenity' }, { w:'PANORÁMICA', m:'panorama; panoramic view' },
    { w:'PARENTESCO', m:'kinship; relationship' }, { w:'PATRIMONIO', m:'heritage; patrimony' }, { w:'PELUQUERÍA', m:'hair salon' },
    { w:'PENITENCIA', m:'penance' }, { w:'PLANTACIÓN', m:'plantation' }, { w:'PLATAFORMA', m:'platform' },
    { w:'PLURALIDAD', m:'plurality' }, { w:'PRECIPICIO', m:'precipice' }, { w:'PREDICCIÓN', m:'prediction' },
    { w:'PRESIDENTE', m:'president' }, { w:'PRETENSIÓN', m:'pretension; claim' }, { w:'PRIVACIDAD', m:'privacy' },
    { w:'PRIVILEGIO', m:'privilege' }, { w:'PULSACIÓN', m:'pulsation' }, { w:'RENOVACIÓN', m:'renewal' },
    { w:'REPARACIÓN', m:'repair' }, { w:'REPETICIÓN', m:'repetition' }, { w:'RESOLUCIÓN', m:'resolution' },
    { w:'REVOLUCIÓN', m:'revolution' }, { w:'SINCERIDAD', m:'sincerity' }, { w:'SEPTIEMBRE', m:'September' },
    { w:'SEPARACIÓN', m:'separation' }, { w:'TERRORISMO', m:'terrorism' }, { w:'TECNOLOGÍA', m:'technology' },
    { w:'TELEVISIÓN', m:'television' }, { w:'SUMINISTRO', m:'supply' }, { w:'SUPERFICIE', m:'surface' },
    { w:'SUPLEMENTO', m:'supplement' }, { w:'VOLUNTARIO', m:'volunteer' }, { w:'VENTILADOR', m:'fan (device)' },
    { w:'AUTOESTIMA', m:'self-esteem' }, { w:'EMPRESARIO', m:'entrepreneur' }, { w:'ENCENDEDOR', m:'lighter' },
    { w:'EQUILIBRIO', m:'balance' }, { w:'ESTUDIANTE', m:'student' }, { w:'EXISTENCIA', m:'existence' },
    { w:'EXPOSICIÓN', m:'exhibition; exposure' }, { w:'FASCINANTE', m:'fascinating' }, { w:'FRECUENCIA', m:'frequency' },
    { w:'INMIGRANTE', m:'immigrant' }, { w:'MERCADERÍA', m:'wares; goods' }, { w:'RECREACIÓN', m:'recreation' },
    { w:'REGULACIÓN', m:'regulation' },
    { w:'PERTENENCIA', m:'belonging' }, { w:'EXPLORACIÓN', m:'exploration' }, { w:'INMIGRACIÓN', m:'immigration' },
    { w:'ALOJAMIENTO', m:'accommodation' }, { w:'CANTIMPLORA', m:'canteen (water bottle)' }, { w:'IMPERMEABLE', m:'raincoat' },
    { w:'CHUBASQUERO', m:'windbreaker' }, { w:'TRIPULACIÓN', m:'crew' }, { w:'ALUCINACIÓN', m:'hallucination' },
    { w:'IMPORTANCIA', m:'importance' }, { w:'RESISTENCIA', m:'resistance' }, { w:'CONFLUENCIA', m:'confluence' },
    { w:'TRAYECTORIA', m:'trajectory' }, { w:'INSTRUCCIÓN', m:'instruction' }, { w:'OBSTRUCCIÓN', m:'obstruction' },
    { w:'DESTRUCCIÓN', m:'destruction' }, { w:'ANIVERSARIO', m:'anniversary' }, { w:'APARTAMENTO', m:'apartment' },
    { w:'APRENDIZAJE', m:'learning' }, { w:'CALEFACCIÓN', m:'heating' }, { w:'CATEDRÁTICO', m:'professor (chair)' },
    { w:'CERTIFICADO', m:'certificate' }, { w:'COMERCIANTE', m:'merchant' }, { w:'COMPARACIÓN', m:'comparison' },
    { w:'CRECIMIENTO', m:'growth' }, { w:'DECLARACIÓN', m:'declaration' }, { w:'DEFORMACIÓN', m:'deformation' },
    { w:'DEGUSTACIÓN', m:'tasting' }, { w:'DESCRIPCIÓN', m:'description' }, { w:'DICCIONARIO', m:'dictionary' },
    { w:'DIPLOMÁTICO', m:'diplomat' }, { w:'ELASTICIDAD', m:'elasticity' }, { w:'ELECTRÓNICO', m:'electronic (device)' },
    { w:'ESPECTÁCULO', m:'show; spectacle' }, { w:'ESTADÍSTICA', m:'statistics' }, { w:'EXPECTATIVA', m:'expectation' },
    { w:'EXPERIMENTO', m:'experiment' }, { w:'EXPLICACIÓN', m:'explanation' }, { w:'FASCINACIÓN', m:'fascination' },
    { w:'FERROCARRIL', m:'railway' }, { w:'GASTRONOMÍA', m:'gastronomy' }, { w:'HELICÓPTERO', m:'helicopter' },
    { w:'HERRAMIENTA', m:'tool' }, { w:'INFORMACIÓN', m:'information' }, { w:'INSTITUCIÓN', m:'institution' },
    { w:'INSTRUMENTO', m:'instrument' }, { w:'LABORATORIO', m:'laboratory' },
    { w:'MOTOCICLETA', m:'motorcycle' }, { w:'OPORTUNIDAD', m:'opportunity' }, { w:'ORIENTACIÓN', m:'orientation' },
    { w:'PONDERACIÓN', m:'pondering; weighing' }, { w:'POPULARIDAD', m:'popularity' }, { w:'PROFESORADO', m:'teaching staff' },
    { w:'PROPOSICIÓN', m:'proposal' }, { w:'PROSPERIDAD', m:'prosperity' }, { w:'UNIVERSIDAD', m:'university' },
    { w:'VENCIMIENTO', m:'expiry; due date' }, { w:'PREPARACIÓN', m:'preparation' }, { w:'PROHIBICIÓN', m:'prohibition' },
    { w:'PROCEDENCIA', m:'origin; provenance' }, { w:'INCLINACIÓN', m:'inclination; slope' }, { w:'INDIGNACIÓN', m:'indignation' },
    { w:'INSPIRACIÓN', m:'inspiration' }, { w:'INSTALACIÓN', m:'installation' }, { w:'INTEGRACIÓN', m:'integration' },
    { w:'INSURGENCIA', m:'insurgency' }, { w:'INGREDIENTE', m:'ingredient' }, { w:'ILUSTRACIÓN', m:'illustration' },
    { w:'COORDINACIÓN', m:'coordination' }, { w:'COLABORACIÓN', m:'collaboration' }, { w:'CONTRIBUCIÓN', m:'contribution' },
    { w:'DISTRIBUCIÓN', m:'distribution' }, { w:'CONSTRUCCIÓN', m:'construction' }, { w:'DESAPARICIÓN', m:'disappearance' },
    { w:'URBANIZACIÓN', m:'urbanization' },
    { w:'SOCIALIZACIÓN', m:'socialization' }, { w:'SIGNIFICACIÓN', m:'significance' }, { w:'TRAUMATOLOGÍA', m:'traumatology' },
    { w:'BACTERIOLOGÍA', m:'bacteriology' }, { w:'MICROBIOLOGÍA', m:'microbiology' }, { w:'QUIMIOTERAPIA', m:'chemotherapy' },
    { w:'INESTABILIDAD', m:'instability' }, { w:'IMPOSIBILIDAD', m:'impossibility' }, { w:'UNIVERSITARIA', m:'university (fem.)' },
    { w:'UNIVERSITARIO', m:'university student' }, { w:'PENITENCIARÍA', m:'penitentiary' }, { w:'CONFEDERACIÓN', m:'confederation' }
  ]
};
// TRIES maps each word length to the number of WRONG guesses the player is
// allowed before losing the round (e.g., a 6-letter word allows 3 misses).
const TRIES = { 5:3, 6:4, 7:4, 8:4, 13:4 };

// ROWS defines the on-screen keyboard layout, top row to bottom row.
// It follows the standard QWERTY layout and adds the Spanish Ñ key

const ROWS = ['QWERTYUIOP', 'ASDFGHJKLÑ', 'ZXCVBNM', 'ÁÉÍÓÚ'];

/* ---------- DOM elements ---------- */
// $ is a shorthand helper: document.querySelector('#id') becomes $('#id').
const $ = (s) => document.querySelector(s);

// els caches references to all HTML elements the game manipulates,
// so we don't have to search the DOM over and over again.
const els = {
  start: $('#screen-start'),    // the start/menu screen
  game: $('#screen-game'),      // the main game screen
  tiles: $('#tiles'),           // container holding the letter tiles
  //tilesWrap: $('#tilesWrap'),   // wrapper around the tiles (layout)
  message: $('#message'),       // status/instruction text line
  stamp: $('#stamp'),           // decorative "stamp" overlay element
  dots: $('#dots'),             // row of dots showing remaining wrong guesses
  lenBadge: $('#lenBadge'),     // badge showing the chosen word length
  keyboard: $('#keyboard'),     // on-screen keyboard container
  result: $('#resultPanel'),    // end-of-round result panel
  //resultWord: $('#resultWord'), // headline inside the result panel
  //resultSub: $('#resultSub'),   // sub-line (score) inside the result panel
  scoreChip: $('#scoreChip'),   // small chip displaying the current score
  soundBtn: $('#soundBtn'),     // sound on/off toggle button
  below: $('#below'),           // area below the board (buttons etc.)
  stage: $('#stage')            // board/stage area used for width measuring
};

// state holds everything that changes while playing a round.
const state = {
  len: 6,            // currently selected word length
  word: '',          // the secret word for this round
  meaning: '',       // English translation of the secret word
  revealed: [],      // one slot per letter: null = hidden, letter = revealed
  triesLeft: 0,      // wrong guesses remaining this round
  maxTries: 0,       // total wrong guesses allowed this round
  used: new Set(),   // letters already guessed (prevents duplicate guesses)
  active: false,     // true while a round is in progress and guesses count
  lastWord: ''       // the previous word, so we avoid picking it twice in a row
};

// Scores are persisted in the browser's localStorage so they survive page
// reloads. The "+(...)" converts the stored string into a number; if nothing
// is stored (null), the expression falls back to 0.
let score = +(localStorage.getItem('wm_score') || 0);          // current win streak
let bestScore = +(localStorage.getItem('wm_best_score') || 0); // best streak ever
let resizeTimeout; // used to debounce window-resize handling (see handleResize)

/* ---------- Sound engine ---------- */
// Sound is a small self-contained audio module built on the Web Audio API.
// It is wrapped in an IIFE (Immediately Invoked Function Expression): the
// function runs once, and only the returned object (the public API at the
// bottom) is exposed — internal variables like ctx and muted stay private.
const Sound = (() => {
  let ctx = null;                                       // the AudioContext, created lazily
  let muted = localStorage.getItem('wm_muted') === '1'; // mute preference, persisted

  // ac() returns the shared AudioContext, creating it on first use.
  // Browsers block audio until the user interacts with the page, so the
  // context is also "resumed" here if the browser suspended it.
  function ac() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // env() shapes a note's volume over time (a volume "envelope"):
  // start at 0 → quickly ramp up to `peak` (attack) → decay exponentially to
  // near-silence. This avoids harsh clicks at the start/end of each sound.
  function env(g, t, a = 0.005, d = 0.15, peak = 0.2) {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }

  // tone() plays one synthesized note.
  //   freq  = pitch in Hz
  //   type  = oscillator waveform (sine, square, triangle, sawtooth…)
  //   dur   = duration in seconds
  //   peak  = volume
  //   slide = optional end frequency (creates a pitch-bend effect)
  //   when  = optional delay in seconds before the note starts
  function tone(freq, { type = 'sine', dur = 0.15, peak = 0.18, slide = null, when = 0 } = {}) {
    if (muted) return;              // do nothing when sound is muted
    const c = ac();
    const t = c.currentTime + when;
    const o = c.createOscillator(); // the sound source (a wave)
    const g = c.createGain();       // node that controls the volume
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur); // pitch slide
    env(g, t, 0.005, dur, peak);
    o.connect(g).connect(c.destination); // oscillator → volume → speakers
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  // noise() generates a short burst of white noise (random audio samples) —
  // used for percussive effects like the "stamp" thump. A lowpass filter
  // removes high frequencies so it sounds deep and muffled, not hissy.
  function noise(dur = 0.08, peak = 0.12, when = 0) {
    if (muted) return;
    const c = ac();
    const t = c.currentTime + when;
    // create an audio buffer filled with random values (white noise)
    const b = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); // fades out linearly
    const s = c.createBufferSource();
    s.buffer = b;
    const g = c.createGain();
    g.gain.value = peak;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900; // cut everything above 900 Hz for a softer sound
    s.connect(f).connect(g).connect(c.destination);
    s.start(t);
  }

  // Public API of the Sound module — the named sound effects used by the game:
  return {
    get muted() { return muted; },   // read-only access to the mute state
    toggle() {                       // flip mute on/off and remember the choice
      muted = !muted;
      localStorage.setItem('wm_muted', muted ? '1' : '0');
      return muted;
    },
    tick() { tone(720, { type: 'square', dur: 0.04, peak: 0.05 }); },  // short key-click
    stamp() { noise(0.09, 0.22); tone(150, { type: 'sine', dur: 0.12, peak: 0.25, slide: 70 }); }, // letter-reveal thump
    error() {                        // descending "wrong guess" buzz
      tone(190, { type: 'sawtooth', dur: 0.22, peak: 0.14, slide: 90 });
      tone(95, { type: 'sawtooth', dur: 0.28, peak: 0.12, slide: 55, when: 0.02 });
    },
    win() {                          // rising victory arpeggio (C–E–G–C)
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(f, { type: 'triangle', dur: 0.16, peak: 0.14, when: i * 0.09 })
      );
      noise(0.06, 0.1);
    },
    lose() {                         // sad descending tones
      tone(220, { type: 'triangle', dur: 0.25, peak: 0.14, slide: 160 });
      tone(160, { type: 'triangle', dur: 0.4, peak: 0.12, slide: 110, when: 0.18 });
    },
    thud() { noise(0.12, 0.3); tone(90, { type: 'sine', dur: 0.18, peak: 0.3, slide: 45 }); }
  };
})();

/* ---------- Keyboard ---------- */
// keyEls stores a reference to each on-screen key button, keyed by its letter
// (e.g., keyEls['A']), so the game can highlight/disable keys later.
const keyEls = {};

// buildKeyboard() creates the on-screen keyboard buttons from the ROWS layout.
function buildKeyboard() {
  els.keyboard.innerHTML = ''; // clear any existing keys first
  ROWS.forEach((row, r) => {
    const div = document.createElement('div');
    div.className = 'kb-row';  // one visual row of keys
    [...row].forEach(L => {    // [...row] splits the string into single letters
      const b = document.createElement('button');
      b.className = 'key';
      b.textContent = L;
      b.dataset.key = L;       // store the letter on the element (data-key="L")

      // 🔍 DEBUG: Log what's actually being created
      console.log('Creating key:', L, 'Code:', L.charCodeAt(0).toString(16));
      
      b.addEventListener('click', () => {
        Sound.tick();          // click feedback...
        guess(L);              // ...then process the guess
      });
      keyEls[L] = b;           // remember this button for later updates
      div.appendChild(b);
    });
    els.keyboard.appendChild(div);
  });
}

/* ---------- Game logic ---------- */

// startRound(len) begins a new round using words of the given length.
function startRound(len) {
  state.len = len;
  let pool = []; // the list of candidate words to pick from

  if (len === 8) {
    // Combine all words with 8 or more letters
    Object.keys(WORDS).forEach(key => {
      if (parseInt(key) >= 8) {
        pool.push(...WORDS[key]);
      }
    });
    // Sort by length to get a variety of word lengths
    // (with a random comparator this actually SHUFFLES the pool randomly)
    pool.sort(() => Math.random() - 0.5);
  } else {
    pool = WORDS[len];
  }

  // Select a word, avoiding repeats
  let entry;
  do {
    entry = pool[Math.floor(Math.random() * pool.length)];
  } while (pool.length > 1 && entry.w === state.lastWord);

  state.lastWord = entry.w;                          // remember for the next round
  state.word = entry.w;                              // the secret word
  state.meaning = entry.m;                           // its translation
  state.maxTries = TRIES[len] || 3;                  // allowed misses (fallback: 3)
  state.triesLeft = state.maxTries;
  state.revealed = Array(entry.w.length).fill(null); // all letters start hidden
  state.used = new Set();                            // no letters guessed yet
  state.active = true;                               // round is now playable

  // Update badge text
  els.lenBadge.textContent = len === 8 ? '8 LETTERS+' : `${len} LETTERS`;

  renderTries();  // draw the miss-dots
  renderTiles();  // draw the blank letter tiles
  Object.values(keyEls).forEach(k => {
    k.disabled = false;                 // re-enable every key...
    k.classList.remove('hit', 'miss');  // ...and clear the previous round's colors
  });

  els.stamp.hidden = true;   // hide leftover decorations
  els.stamp.className = 'stamp';
  els.result.hidden = true;  // hide the result panel

  setMessage(`Pick letters — you can miss ${state.maxTries} time${state.maxTries > 1 ? 's' : ''}.`, '');
  showScreen('game');

  // Delay fitTiles to ensure DOM is ready
  setTimeout(() => {
    fitTiles(); // size the tiles once the new tiles are actually in the DOM
    window.addEventListener('resize', handleResize); // keep tiles sized on resize
  }, 50);
}

// renderTiles() builds one blank tile per letter of the secret word.
function renderTiles() {
  els.tiles.innerHTML = ''; // remove old tiles
  const wordLength = state.word.length;

  // Add long-word class for words with 10+ letters
  if (wordLength >= 10) {
    els.tiles.classList.add('long-word'); // CSS makes long words more compact
  } else {
    els.tiles.classList.remove('long-word');
  }

  [...state.word].forEach((ch, i) => {
    const t = document.createElement('div');
    t.className = 'tile';
    t.style.setProperty('--i', i); // CSS variable used for staggered animations
    const s = document.createElement('span');
    s.className = 'letter';        // this span will hold the revealed letter
    t.appendChild(s);
    els.tiles.appendChild(t);
  });

  // Force recalculation after rendering
  requestAnimationFrame(() => fitTiles()); // size tiles on the next animation frame
}

// fitTiles() responsively calculates the tile size so the whole word fits
// within the visible width of the stage, then applies it via CSS variables.
function fitTiles() {
  if (!state.word) return; // nothing to size before a round starts

  const n = state.word.length;       // number of letters/tiles
  const stageWidth = els.stage.clientWidth;

  // Calculate available width considering padding
  const avail = stageWidth - 16;

  // Dynamic gap based on word length — longer words get tighter spacing
  const gap = n > 12 ? 2 : n > 10 ? 3 : n > 8 ? 4 : Math.min(8, Math.max(4, 8 - (n * 0.5)));

  // Calculate ideal tile size: divide the available width evenly among tiles
  const idealSize = Math.floor((avail - (n - 1) * gap) / n);

  // Dynamic min/max sizes based on word length (longer words → smaller tiles)
  const minSize = n > 12 ? 16 : n > 10 ? 18 : n > 8 ? 20 : 24;
  const maxSize = n > 12 ? 28 : n > 10 ? 32 : n > 8 ? 36 : 40;

  // Clamp the ideal size between the min and max bounds
  const size = Math.max(minSize, Math.min(maxSize, idealSize));

  // Apply the calculated size
  els.tiles.style.setProperty('--tile', `${size}px`); // consumed by the CSS
  els.tiles.style.gap = `${gap}px`;

  // Adjust font size for very small tiles
  if (size < 20) {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.6'); // smallest tiles → biggest font ratio
  } else if (size < 25) {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.55');
  } else {
    document.documentElement.style.setProperty('--tile-font-ratio', '0.5'); // normal tiles
  }
}

// handleResize() recalculates tile sizes when the browser window is resized,
// but "debounced": it waits 100ms after the LAST resize event before running,
// so dragging the window doesn't trigger dozens of recalculations.
function handleResize() {
  clearTimeout(resizeTimeout); // cancel any pending recalculation
  resizeTimeout = setTimeout(() => {
    if (els.game.classList.contains('active')) {
      fitTiles(); // only recalculate if the game screen is visible
    }
  }, 100);
}

// revealLetter(L) uncovers every occurrence of letter L in the word,
// animates the tiles, updates the keyboard, and returns the number of hits.
function revealLetter(L) {
  const hits = [];
  [...state.word].forEach((ch, i) => {
    if (ch === L) hits.push(i); // collect all positions where L appears
  });
  const key = keyEls[L];
  key.classList.add('hit');   // mark the key green (via CSS)
  key.disabled = true;        // this letter can't be guessed again
  hits.forEach((i, k) => {
    const tile = els.tiles.children[i];
    // random slight tilt between -2.5° and +2.5° for a natural "stamped" look
    tile.style.setProperty('--tilt', (Math.random() * 5 - 2.5).toFixed(2) + 'deg');
    tile.style.animationDelay = (k * 110) + 'ms'; // stagger multiple reveals
    tile.classList.add('revealed');               // triggers the reveal animation
    tile.firstElementChild.textContent = L;       // show the letter on the tile
    state.revealed[i] = L;                        // record it in the game state
  });
  Sound.stamp();
  return hits.length;
}

// guess(L) is the heart of the game: it handles one letter guess from
// start to finish (correct reveal OR wrong-guess penalty).
function guess(L) {
  // ignore the guess if the round is over or the letter was already tried
  if (!state.active || state.used.has(L)) return;
  state.used.add(L);
  const hits = [];
  [...state.word].forEach((ch, i) => {
    if (ch === L) hits.push(i); // find all matching positions
  });

  if (hits.length) {
    // --- Correct guess ---
    revealLetter(L);
    const n = hits.length;
    setMessage(n > 1 ? `“${L}” is in the word — ${n}×!` : `“${L}” is in the word!`, 'good');
    if (state.revealed.every(Boolean)) endRound(true); // every letter revealed → win!
  } else {
    // --- Wrong guess ---
    const key = keyEls[L];
    key.classList.add('miss');  // mark the key red (via CSS)
    key.disabled = true;
    state.triesLeft--;          // use up one try
    renderTries();              // update the dots display
    shake();                    // shake the tile row for feedback
    Sound.error();
    const left = state.triesLeft;
    setMessage(left > 0 ? `No “${L}” here — ${left} tr${left === 1 ? 'y' : 'ies'} left.` : `No “${L}” here — that was your last try.`, 'bad');
    if (left <= 0) endRound(false); // out of tries → lose
  }
}

// shake() plays the CSS "shake" animation on the tile row (wrong-guess feedback).
function shake() {
  const t = els.tiles;
  t.classList.remove('shake');
  void t.offsetWidth;  // force a browser reflow so the animation can restart
  t.classList.add('shake');
  t.addEventListener('animationend', () => t.classList.remove('shake'), { once: true });
}

// renderTries() redraws the row of dots showing how many wrong guesses remain.
function renderTries() {
  els.dots.innerHTML = '';
  for (let i = 0; i < state.maxTries; i++) {
    const d = document.createElement('span');
    // dots at/after triesLeft have been "used" (spent misses)
    d.className = 'dot' + (i >= state.triesLeft ? ' used' : '');
    if (i === state.triesLeft) d.classList.add('just'); // highlight the dot just lost
    els.dots.appendChild(d);
  }
}

// setMessage(text, kind) updates the status line. kind is '', 'good' or 'bad'
// and controls the message color. The 'pop' animation restarts each time.
function setMessage(text, kind) {
  els.message.textContent = text;
  els.message.className = 'message' + (kind ? ' ' + kind : '');
  els.message.classList.remove('pop');
  void els.message.offsetWidth;      // reflow trick to restart the animation
  els.message.classList.add('pop');
}

// endRound(win) finishes the round: updates the score, plays sounds and
// animations, reveals the answer, and shows the result panel.
function endRound(win) {
  state.active = false;                                  // stop accepting guesses
  Object.values(keyEls).forEach(k => k.disabled = true); // lock the keyboard

  if (win) {
    score++;                                             // extend the win streak
    if (score > bestScore) {
      bestScore = score;                                 // new personal best
      localStorage.setItem('wm_best_score', bestScore);
    }
    localStorage.setItem('wm_score', score);             // persist the streak
    updateScoreChip();
    bounceTiles();  // celebratory tile animation
    Sound.win();
    setMessage(`Correct! The word means: "${state.meaning}"`, 'good');
    setTimeout(showResult, 1000);                        // show result panel after 1s
  } else {
    score = 0;                                           // losing resets the streak
    localStorage.setItem('wm_score', 0);
    updateScoreChip();
    // Reveal the missed letters one by one so the player sees the full answer
    [...state.word].forEach((ch,i)=>{
      if (!state.revealed[i]){
        const tile = els.tiles.children[i];
        tile.style.setProperty('--tilt','0deg');
        // staggered reveal: starts after 250ms, 70ms apart per letter
        setTimeout(()=>{ tile.classList.add('miss'); tile.firstElementChild.textContent = ch; }, 250 + i*70);
      }
    });
    setTimeout(()=>{ setMessage(`Game over! The word was "${state.word}" and means: "${state.meaning}"`, 'bad'); }, 650);
    setTimeout(()=>{ Sound.lose(); }, 650);
    setTimeout(showResult, 1500);                        // show result panel after 1.5s
  }
}

// bounceTiles() makes every tile bounce, staggered left-to-right (win animation).
function bounceTiles() {
  [...els.tiles.children].forEach((t, i) => {
    t.style.animationDelay = '0ms';
    setTimeout(() => { t.classList.add('bounce'); }, i * 70); // 70ms apart
  });
}

// showResult() displays the end-of-round panel with the outcome and score.
//function showResult() {
//  els.resultWord.innerHTML = state.revealed.every(Boolean)
//    ? `<strong>Correct!</strong>`  // all letters were revealed → win
//    : `Game over`;                 // ran out of tries → loss
//  els.resultSub.textContent = `Score: ${score}`;
//  els.result.hidden = false;
//}

function showResult() {
  const resultWord = els.result.querySelector('.result-word');   // ✅ Query from existing element
  const resultSub = els.result.querySelector('.result-sub');     // ✅ Query from existing element
  
  if (resultWord) {
    resultWord.innerHTML = state.revealed.every(Boolean)
      ? `<strong>Correct!</strong>`
      : `Game over`;
  }
  
  if (resultSub) {
    resultSub.textContent = `Score: ${score}`;
  }
  
  els.result.hidden = false;
}

// updateScoreChip() refreshes the small score display (e.g., "SCORE 4").
function updateScoreChip() {
  els.scoreChip.innerHTML = `SCORE <b>${score}</b>`;
}

// showScreen(name) switches between the 'start' menu and the 'game' screen
// by toggling the CSS 'active' class on each screen element.
function showScreen(name) {
  els.start.classList.toggle('active', name === 'start');
  els.game.classList.toggle('active', name === 'game');

  if (name === 'start') {
    window.removeEventListener('resize', handleResize); // not needed on the menu
  }
}

/* ---------- Event listeners ---------- */

// Everything below runs once the HTML has finished loading, so all elements
// referenced here are guaranteed to exist in the page.
document.addEventListener('DOMContentLoaded', function() {
  buildKeyboard();    // create the on-screen keyboard
  updateScoreChip();  // show the saved score
  renderSoundIcon();  // show the correct speaker icon
  fitTiles();         // initial tile sizing

  const nextBtn = $('#nextBtn');     // "next word" button (same length)
  const backBtn = $('#backBtn');     // "back to menu" button
  const randomBtn = $('#randomBtn'); // "random length" button
  const soundBtn = $('#soundBtn');   // mute toggle button

  if (nextBtn) nextBtn.addEventListener('click', () => startRound(state.len));
  if (backBtn) backBtn.addEventListener('click', () => showScreen('start'));
  if (randomBtn) randomBtn.addEventListener('click', () => {
    const lens = [5, 6, 7, 8, 13];
    startRound(lens[Math.floor(Math.random() * lens.length)]); // pick a random length
  });
  if (soundBtn) soundBtn.addEventListener('click', () => {
    Sound.toggle();       // flip mute state (also saved to localStorage)
    renderSoundIcon();    // update the speaker icon
    if (!Sound.muted) Sound.tick(); // confirmation click when unmuting
  });

  // The word-length option buttons on the start screen (data-len="5" etc.)
  document.querySelectorAll('.opt').forEach(o => {
    o.addEventListener('click', () => startRound(+o.dataset.len)); // "+" converts string to number
  });
});

// renderSoundIcon() shows the speaker-on or speaker-off icon depending on
// whether sound is currently muted.
function renderSoundIcon() {
  const iconSoundOn = $('#iconSoundOn');
  const iconSoundOff = $('#iconSoundOff');
  if (iconSoundOn && iconSoundOff) {
    iconSoundOn.style.display = Sound.muted ? 'none' : 'block';
    iconSoundOff.style.display = Sound.muted ? 'block' : 'none';
  }
}

// Keyboard event listener — lets the player use a physical keyboard
// instead of clicking the on-screen keys.
document.addEventListener('keydown', (e) => {
  if (els.game.classList.contains('active')) {
    // On the game screen:
    if (e.key === 'Enter' && !state.active && !els.result.hidden) {
      startRound(state.len); // Enter starts the next round after a round ends
      return;
    }
    const k = e.key.toUpperCase();
    // Accept single letters A–Z plus Spanish Á É Í Ó Ú Ñ, but ignore
    // combos with Meta/Ctrl/Alt (so browser shortcuts like Ctrl+C still work)
    //if (/^[A-ZÄÖÜ]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
    //if (/^[A-ZÄÖÜß]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
    if (/^[A-ZÁÉÍÓÚÑ]$/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (keyEls[k]) {   // only letters that exist on our virtual keyboard
        Sound.tick();
        guess(k);
      }
    }
  } else {
    // On the start screen: pressing 5/6/7/8 quickly starts that word length
    if (/^[5678]$/.test(e.key)) startRound(+e.key);
  }
});
