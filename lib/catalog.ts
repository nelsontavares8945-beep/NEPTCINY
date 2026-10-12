export type Rating = 'L' | '10' | '12' | '14'
export type TitleType = 'filme' | 'serie'

export interface Episode {
  id: string
  number: number
  title: string
  description: string
  duration: string
  video: string
}

export interface Season {
  number: number
  episodes: Episode[]
}

export interface Title {
  id: string
  type: TitleType
  title: string
  tagline: string
  description: string
  year: number
  rating: Rating
  duration: string
  genres: string[]
  image: string
  video: string
  match: number
  featured?: boolean
  trending?: boolean
  kids?: boolean
  cast: string[]
  director: string
  audio: string[]
  subtitles: string[]
  seasons?: Season[]
}

export interface Channel {
  id: string
  number: number
  name: string
  category: string
  description: string
  video: string
  accent: string
  schedule: { time: string; program: string }[]
}

const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons/transcoded'
const MDN = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos'
const TEST_VIDEOS = 'https://test-videos.co.uk/vids'

// Open-licensed videos (Blender Foundation, CC0) used as demo content until real licensed streams are added.
export const VIDEOS = {
  bunny: `${WIKIMEDIA}/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm`,
  dream: `${WIKIMEDIA}/8/88/Big_Buck_Bunny_alt.webm/Big_Buck_Bunny_alt.webm.720p.vp9.webm`,
  sintel: `${WIKIMEDIA}/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.720p.vp9.webm`,
  steel: `${WIKIMEDIA}/a/ab/Caminandes_3_-_Llamigos_-_Blender_Animated_Short.webm/Caminandes_3_-_Llamigos_-_Blender_Animated_Short.webm.720p.vp9.webm`,
  blazes: 'https://vjs.zencdn.net/v/oceans.mp4',
  escapes: `${MDN}/flower.mp4`,
  fun: `${TEST_VIDEOS}/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4`,
  joyrides: `${TEST_VIDEOS}/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4`,
  meltdowns: `${TEST_VIDEOS}/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4`,
  subaru: `${MDN}/friday.mp4`,
  bullrun: 'https://vjs.zencdn.net/v/oceans.webm',
  grand: `${WIKIMEDIA}/a/ab/Caminandes_3_-_Llamigos_-_Blender_Animated_Short.webm/Caminandes_3_-_Llamigos_-_Blender_Animated_Short.webm.720p.vp9.webm`,
} as const

export const SUBTITLE_TRACKS = [
  { code: 'pt', label: 'Português', src: '/subtitles/demo-pt.vtt' },
  { code: 'en', label: 'English', src: '/subtitles/demo-en.vtt' },
  { code: 'es', label: 'Español', src: '/subtitles/demo-es.vtt' },
] as const

export const RATING_ORDER: Rating[] = ['L', '10', '12', '14']

export const RATING_LABEL: Record<Rating, string> = {
  L: 'Livre',
  '10': '10 anos',
  '12': '12 anos',
  '14': '14 anos',
}

const episodeVideos = [VIDEOS.fun, VIDEOS.joyrides, VIDEOS.meltdowns, VIDEOS.escapes, VIDEOS.blazes, VIDEOS.bullrun]

function buildSeasons(
  slug: string,
  seasons: { number: number; episodes: { title: string; description: string; duration: string }[] }[],
): Season[] {
  let index = 0
  return seasons.map((season) => ({
    number: season.number,
    episodes: season.episodes.map((episode, i) => {
      const video = episodeVideos[index % episodeVideos.length]
      index++
      return {
        id: `${slug}-t${season.number}e${i + 1}`,
        number: i + 1,
        video,
        ...episode,
      }
    }),
  }))
}

const defaultAudio = ['Português', 'English']
const defaultSubtitles = ['Português', 'English', 'Español']

export const TITLES: Title[] = [
  {
    id: 'o-ultimo-farol',
    type: 'filme',
    title: 'O Último Farol',
    tagline: 'Quando a luz se apaga, a coragem acende.',
    description:
      'Em uma pequena vila de pescadores, a jovem Marina descobre que o velho farol guarda um segredo capaz de salvar a cidade de uma tempestade lendária. Uma aventura emocionante sobre família, coragem e esperança.',
    year: 2025,
    rating: '10',
    duration: '1h 48min',
    genres: ['Aventura', 'Drama'],
    image: '/titles/ultimo-farol.png',
    video: VIDEOS.sintel,
    match: 98,
    featured: true,
    trending: true,
    cast: ['Ana Ribeiro', 'Carlos Mendes', 'Júlia Prado'],
    director: 'Fernanda Lopes',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'pequenos-gigantes',
    type: 'filme',
    title: 'Pequenos Gigantes',
    tagline: 'O tamanho não define o herói.',
    description:
      'Um grupo de insetos amigos precisa atravessar o enorme quintal para salvar o jardim antes do inverno chegar. Uma animação divertida e cheia de cores para todas as idades.',
    year: 2024,
    rating: 'L',
    duration: '1h 32min',
    genres: ['Animação', 'Comédia'],
    image: '/titles/pequenos-gigantes.png',
    video: VIDEOS.bunny,
    match: 96,
    featured: true,
    trending: true,
    kids: true,
    cast: ['Vozes de Pedro Lima', 'Bia Santos', 'Rafael Couto'],
    director: 'Marcos Tanaka',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'rota-das-estrelas',
    type: 'filme',
    title: 'Rota das Estrelas',
    tagline: 'A próxima fronteira é a sua casa.',
    description:
      'A tripulação da nave Aurora parte em uma missão para encontrar um novo planeta habitável. No caminho, descobrem que a maior aventura é permanecer unidos.',
    year: 2025,
    rating: '12',
    duration: '2h 05min',
    genres: ['Ficção científica', 'Aventura'],
    image: '/titles/rota-das-estrelas.png',
    video: VIDEOS.steel,
    match: 94,
    featured: true,
    trending: true,
    cast: ['Lucas Andrade', 'Mariana Costa', 'Diego Nunes'],
    director: 'Paula Azevedo',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'a-floresta-encantada',
    type: 'filme',
    title: 'A Floresta Encantada',
    tagline: 'Toda magia começa com um passo.',
    description:
      'Dois irmãos seguem um pequeno espírito-raposa até uma floresta onde a natureza fala e os sonhos ganham forma. Um conto mágico sobre amizade e respeito à natureza.',
    year: 2023,
    rating: 'L',
    duration: '1h 40min',
    genres: ['Fantasia', 'Animação'],
    image: '/titles/floresta-encantada.png',
    video: VIDEOS.dream,
    match: 92,
    kids: true,
    cast: ['Sofia Martins', 'Gabriel Rocha'],
    director: 'Helena Duarte',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'corrida-final',
    type: 'filme',
    title: 'Corrida Final',
    tagline: 'Cada curva é uma escolha.',
    description:
      'Um time de jovens pilotos de kart treina para o campeonato nacional e aprende que trabalho em equipe vale mais que qualquer troféu.',
    year: 2024,
    rating: '10',
    duration: '1h 55min',
    genres: ['Ação', 'Esporte'],
    image: '/titles/corrida-final.png',
    video: VIDEOS.subaru,
    match: 89,
    trending: true,
    cast: ['Thiago Reis', 'Larissa Moura', 'Bruno Alves'],
    director: 'Renato Farias',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'receitas-da-vovo',
    type: 'filme',
    title: 'Receitas da Vovó',
    tagline: 'O ingrediente secreto é o amor.',
    description:
      'Dona Cida decide participar de um concurso de culinária com a ajuda dos netos bagunceiros. O resultado é uma comédia deliciosa sobre gerações e afeto.',
    year: 2022,
    rating: 'L',
    duration: '1h 37min',
    genres: ['Comédia', 'Família'],
    image: '/titles/receitas-da-vovo.png',
    video: VIDEOS.grand,
    match: 91,
    kids: true,
    cast: ['Regina Alves', 'Enzo Ferreira', 'Laura Campos'],
    director: 'Cláudio Bastos',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'expedicao-artica',
    type: 'filme',
    title: 'Expedição Ártica',
    tagline: 'A vida no limite do mundo.',
    description:
      'Acompanhe uma família de ursos-polares durante um ano inteiro no Ártico, em imagens de tirar o fôlego sobre sobrevivência e o futuro do planeta.',
    year: 2024,
    rating: 'L',
    duration: '1h 25min',
    genres: ['Documentário', 'Natureza'],
    image: '/titles/expedicao-artica.png',
    video: VIDEOS.bullrun,
    match: 95,
    cast: ['Narração de Ricardo Lemos'],
    director: 'Isabela Fontes',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'misterio-no-museu',
    type: 'filme',
    title: 'Mistério no Museu',
    tagline: 'Algumas histórias ganham vida à noite.',
    description:
      'Três amigos ficam presos no museu da cidade durante uma excursão e descobrem que uma joia lendária desapareceu. Agora eles precisam resolver o caso antes do amanhecer.',
    year: 2025,
    rating: '10',
    duration: '1h 44min',
    genres: ['Mistério', 'Aventura'],
    image: '/titles/misterio-do-museu.png',
    video: VIDEOS.sintel,
    match: 93,
    trending: true,
    cast: ['Davi Moreira', 'Alice Teixeira', 'Nina Costa'],
    director: 'Fernanda Lopes',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
  },
  {
    id: 'familia-oliveira',
    type: 'serie',
    title: 'Família Oliveira',
    tagline: 'Uma casa, cinco opiniões, nenhum silêncio.',
    description:
      'O dia a dia caótico e muito divertido da família Oliveira, que tenta equilibrar trabalho, escola, vizinhos curiosos e um cachorro que não para quieto.',
    year: 2024,
    rating: 'L',
    duration: '2 temporadas',
    genres: ['Comédia', 'Família'],
    image: '/titles/familia-oliveira.png',
    video: VIDEOS.fun,
    match: 97,
    featured: true,
    trending: true,
    kids: true,
    cast: ['Paulo Oliveira', 'Cristina Melo', 'Theo Ramos'],
    director: 'Juliana Prates',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
    seasons: buildSeasons('familia-oliveira', [
      {
        number: 1,
        episodes: [
          { title: 'A mudança', description: 'A família se muda para uma casa nova e nada sai como planejado.', duration: '24min' },
          { title: 'O churrasco', description: 'Paulo tenta impressionar os vizinhos com um churrasco desastroso.', duration: '23min' },
          { title: 'Feira de ciências', description: 'Theo transforma a cozinha em laboratório para a feira da escola.', duration: '25min' },
          { title: 'Férias na praia', description: 'Uma viagem em família vira uma aventura inesperada.', duration: '26min' },
        ],
      },
      {
        number: 2,
        episodes: [
          { title: 'O novo integrante', description: 'Um gatinho aparece e o cachorro Bolinha não aprova.', duration: '24min' },
          { title: 'Noite de jogos', description: 'A competição em família sai do controle.', duration: '22min' },
          { title: 'Aniversário surpresa', description: 'Todos tentam esconder uma festa surpresa da mãe.', duration: '25min' },
        ],
      },
    ]),
  },
  {
    id: 'detetives-mirins',
    type: 'serie',
    title: 'Detetives Mirins',
    tagline: 'Nenhum mistério é pequeno demais.',
    description:
      'Em uma cidadezinha tranquila, um grupo de crianças curiosas forma uma agência de detetives e resolve casos misteriosos com bicicletas, lupas e muita imaginação.',
    year: 2023,
    rating: '10',
    duration: '2 temporadas',
    genres: ['Mistério', 'Aventura'],
    image: '/titles/detetives-mirins.png',
    video: VIDEOS.joyrides,
    match: 90,
    trending: true,
    cast: ['Miguel Souza', 'Clara Lins', 'João Pedro Dias'],
    director: 'Rodrigo Valente',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
    seasons: buildSeasons('detetives-mirins', [
      {
        number: 1,
        episodes: [
          { title: 'O caso do relógio', description: 'O relógio da praça para misteriosamente às 3h.', duration: '28min' },
          { title: 'Pegadas na lama', description: 'Estranhas pegadas aparecem perto da escola.', duration: '27min' },
          { title: 'A carta anônima', description: 'Uma carta sem remetente leva a turma a um tesouro.', duration: '29min' },
        ],
      },
      {
        number: 2,
        episodes: [
          { title: 'O sumiço do troféu', description: 'O troféu da escola desaparece na véspera do campeonato.', duration: '28min' },
          { title: 'Luzes na colina', description: 'Luzes estranhas aparecem toda noite na colina.', duration: '30min' },
        ],
      },
    ]),
  },
  {
    id: 'planeta-azul',
    type: 'serie',
    title: 'Planeta Azul',
    tagline: 'Descubra o mundo que existe sob as ondas.',
    description:
      'Uma série documental que mergulha nos oceanos do planeta para revelar criaturas incríveis, recifes coloridos e a importância da preservação marinha.',
    year: 2025,
    rating: 'L',
    duration: '1 temporada',
    genres: ['Documentário', 'Natureza'],
    image: '/titles/planeta-azul.png',
    video: VIDEOS.escapes,
    match: 99,
    featured: true,
    cast: ['Narração de Beatriz Lemos'],
    director: 'Isabela Fontes',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
    seasons: buildSeasons('planeta-azul', [
      {
        number: 1,
        episodes: [
          { title: 'Gigantes do mar', description: 'A jornada das baleias-jubarte pelos oceanos.', duration: '48min' },
          { title: 'Cidades de coral', description: 'A vida vibrante dos recifes de coral.', duration: '46min' },
          { title: 'As profundezas', description: 'Criaturas que vivem onde a luz não chega.', duration: '50min' },
          { title: 'Costas brasileiras', description: 'A riqueza marinha do litoral do Brasil.', duration: '47min' },
        ],
      },
    ]),
  },
  {
    id: 'academia-de-herois',
    type: 'serie',
    title: 'Academia de Heróis',
    tagline: 'Todo herói começa como aprendiz.',
    description:
      'Jovens com poderes especiais estudam em uma escola secreta onde aprendem que o maior superpoder é a amizade. Animação cheia de ação e humor.',
    year: 2024,
    rating: '10',
    duration: '1 temporada',
    genres: ['Animação', 'Ação'],
    image: '/titles/academia-de-herois.png',
    video: VIDEOS.blazes,
    match: 94,
    kids: true,
    cast: ['Vozes de Lara Mendes', 'Felipe Prado', 'Duda Rocha'],
    director: 'Marcos Tanaka',
    audio: defaultAudio,
    subtitles: defaultSubtitles,
    seasons: buildSeasons('academia-de-herois', [
      {
        number: 1,
        episodes: [
          { title: 'Primeiro dia', description: 'Novos alunos descobrem seus poderes na academia.', duration: '22min' },
          { title: 'Teste de equipe', description: 'A turma precisa trabalhar junta pela primeira vez.', duration: '21min' },
          { title: 'O vilão da cantina', description: 'Uma confusão na cantina revela um mistério.', duration: '22min' },
          { title: 'Grande final', description: 'Os aprendizes enfrentam seu maior desafio.', duration: '24min' },
        ],
      },
    ]),
  },
]

export const CHANNELS: Channel[] = [
  {
    id: 'neptciny-kids',
    number: 2,
    name: 'NEPTCINY Kids',
    category: 'Infantil',
    description: 'Desenhos e programas educativos o dia inteiro.',
    video: VIDEOS.bunny,
    accent: 'from-amber-400 to-orange-500',
    schedule: [
      { time: '08:00', program: 'Bom dia, Turminha' },
      { time: '09:30', program: 'Academia de Heróis' },
      { time: '11:00', program: 'Pequenos Gigantes' },
      { time: '13:00', program: 'Hora da Música' },
    ],
  },
  {
    id: 'neptciny-noticias',
    number: 4,
    name: 'NEPTCINY Notícias',
    category: 'Jornalismo',
    description: 'As principais notícias do Brasil e do mundo, ao vivo.',
    video: VIDEOS.meltdowns,
    accent: 'from-sky-400 to-blue-600',
    schedule: [
      { time: '07:00', program: 'Jornal da Manhã' },
      { time: '12:00', program: 'Edição do Meio-dia' },
      { time: '19:00', program: 'Jornal da Noite' },
      { time: '22:00', program: 'Últimas Notícias' },
    ],
  },
  {
    id: 'neptciny-esportes',
    number: 7,
    name: 'NEPTCINY Esportes',
    category: 'Esportes',
    description: 'Futebol, vôlei, automobilismo e muito mais.',
    video: VIDEOS.subaru,
    accent: 'from-emerald-400 to-green-600',
    schedule: [
      { time: '10:00', program: 'Esporte Total' },
      { time: '14:00', program: 'Rally ao Vivo' },
      { time: '16:00', program: 'Futebol da Tarde' },
      { time: '21:00', program: 'Mesa Redonda' },
    ],
  },
  {
    id: 'cine-familia',
    number: 9,
    name: 'Cine Família',
    category: 'Filmes',
    description: 'Filmes para assistir com toda a família, sem interrupções.',
    video: VIDEOS.dream,
    accent: 'from-rose-400 to-red-600',
    schedule: [
      { time: '13:00', program: 'Sessão da Tarde' },
      { time: '15:30', program: 'A Floresta Encantada' },
      { time: '18:00', program: 'Clássicos de Sempre' },
      { time: '20:30', program: 'Cinema em Casa' },
    ],
  },
  {
    id: 'natureza-viva',
    number: 11,
    name: 'Natureza Viva',
    category: 'Documentários',
    description: 'Os segredos da natureza em alta definição.',
    video: VIDEOS.escapes,
    accent: 'from-teal-400 to-cyan-600',
    schedule: [
      { time: '09:00', program: 'Planeta Azul' },
      { time: '12:00', program: 'Expedição Ártica' },
      { time: '16:00', program: 'Selvas do Brasil' },
      { time: '20:00', program: 'Vida Selvagem' },
    ],
  },
  {
    id: 'neptciny-musica',
    number: 13,
    name: 'NEPTCINY Música',
    category: 'Música',
    description: 'Clipes, shows e os sucessos do momento.',
    video: VIDEOS.fun,
    accent: 'from-fuchsia-400 to-purple-600',
    schedule: [
      { time: '10:00', program: 'Top 20' },
      { time: '14:00', program: 'Acústico' },
      { time: '18:00', program: 'Ao Vivo no Palco' },
      { time: '23:00', program: 'Noite Eletrônica' },
    ],
  },
]

export const GENRES = Array.from(new Set(TITLES.flatMap((title) => title.genres))).sort((a, b) =>
  a.localeCompare(b, 'pt-BR'),
)

export function isAllowed(rating: Rating, maxRating: Rating) {
  return RATING_ORDER.indexOf(rating) <= RATING_ORDER.indexOf(maxRating)
}

export function getTitles(maxRating: Rating = '14') {
  return TITLES.filter((title) => isAllowed(title.rating, maxRating))
}

export function getTitle(id: string) {
  return TITLES.find((title) => title.id === id)
}

export function getChannel(id: string) {
  return CHANNELS.find((channel) => channel.id === id)
}

export function findEpisode(title: Title, episodeId?: string) {
  if (!title.seasons) return undefined
  const episodes = title.seasons.flatMap((season) => season.episodes.map((episode) => ({ ...episode, season: season.number })))
  const found = episodes.findIndex((episode) => episode.id === episodeId)
  const index = found === -1 ? 0 : found
  return { ...episodes[index], next: episodes[index + 1] as (typeof episodes)[number] | undefined }
}
