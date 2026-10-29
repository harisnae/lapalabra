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
    { w:'LENTE', m:'lens' }, { w:'MARCO', m:'frame' }
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
    { w:'KÉCHUP', m:'ketchup' }, { w:'CEREZA', m:'cherry' }, { w:'PAPAYA', m:'papaya' },
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
    { w:'LLANTO', m:'crying; weeping' }, { w:'GUERRA', m:'war' }, { w:'TRIUNFO', m:'triumph' },
    { w:'RUTINA', m:'routine' }, { w:'HÁBITO', m:'habit' }, { w:'CONVITE', m:'treat; invitation' }
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
    { w:'PLANETA', m:'planet' }, { w:'GALAXIA', m:'galaxy' },
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
    { w:'AUDACIA', m:'boldness' }
  ],
  8: [
    { w:'MANZANA', m:'apple' }, { w:'AGUACATE', m:'avocado' }, { w:'CALABAZA', m:'pumpkin; squash' },
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
    { w:'PETICIÓN', m:'request' }
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
    { w:'CANDIDATO', m:'candidate' }, { w:'CARNIVORO', m:'carnivore' }, { w:'CATEGORÍA', m:'category' },
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
    { w:'REGULACIÓN', m:'regulation' }, { w:'INTERPRETACIÓN', m:'interpretation' },
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
