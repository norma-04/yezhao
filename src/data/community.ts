// ─── 野造 · 社区数据 ───
import type { Author } from '@/lib/types'

export interface CommunityPost {
  id: string; slug: string; title: string; content: string; images: string[]
  topic: string; tags: string[]; author: Author; likes_count: number; comments_count: number
  favorites_count: number; is_liked: boolean; is_favorited: boolean
  process_steps: { title: string; description: string }[]
  materials_used: { name: string; slug: string | null }[]
  related_tutorial_slugs: string[]
  created_at: string
}

export interface CommunityComment {
  id: string; postSlug: string; author: Author; content: string
  created_at: string; parent_id: string | null
}

export interface Creator {
  id: string; author: Author; specialty: string; works_count: number; total_likes: number
  bio: string
}

export interface Challenge {
  id: string; title: string; description: string; icon: string; participants: number; end_date: string
}

const authors: Record<string, Author> = {
  u10: { id: 'u10', nickname: '手工小白', avatar_url: null },
  u11: { id: 'u11', nickname: '编织控', avatar_url: null },
  u12: { id: 'u12', nickname: '皮皮虾', avatar_url: null },
  u13: { id: 'u13', nickname: '木木夕', avatar_url: null },
  u14: { id: 'u14', nickname: '黏土艺术家', avatar_url: null },
  u16: { id: 'u16', nickname: '绣花娘', avatar_url: null },
  u18: { id: 'u18', nickname: '木头人', avatar_url: null },
  u19: { id: 'u19', nickname: '材料控', avatar_url: null },
  u23: { id: 'u23', nickname: '养皮人', avatar_url: null },
  u0: { id: 'u0', nickname: '野造小助手', avatar_url: null },
}

export const communityPosts: CommunityPost[] = [
  {
    id: 'p1', slug: 'first-rattan-basket', title: '第一次完成藤编收纳篮，太有成就感了！',
    content: '跟着小藤匠老师的教程一步步做，花了三个晚上终于完成了！虽然收口处有点歪，但整体还是很满意的。藤编真的是一门需要耐心的手艺，每根藤条都要细心处理。最大的心得就是：编织时保持藤条湿润，力度要均匀，不能着急。',
    images: [], topic: 'showcase', tags: ['藤编', '收纳篮', '新手首作'],
    author: authors.u10, likes_count: 238, comments_count: 15, favorites_count: 89, is_liked: false, is_favorited: false,
    process_steps: [
      { title: '材料准备', description: '买了印尼藤条3mm、编织剪刀和尖嘴钳，总共花了不到200元。' },
      { title: '浸泡处理', description: '藤条泡了30分钟温水，泡完真的很软很好编！' },
      { title: '编织过程', description: '底部花了2小时，篮身编了3个晚上，收口是最难的部分。' },
      { title: '心得总结', description: '第一次做不要太追求完美，重要的是享受过程。下一个作品准备试试手提包！' },
    ],
    materials_used: [{ name: '天然印尼藤条(3mm)', slug: 'natural-rattan' }, { name: '木蜡油', slug: null }],
    related_tutorial_slugs: ['beginner-weaving-basket'],
    created_at: '2026-05-25',
  },
  {
    id: 'p2', slug: 'leather-cardholder-first', title: '皮具新手入坑一个月，分享我踩过的5个坑',
    content: '入坑皮具一个月了，从最开始的连斩都打不直到现在能做简单的卡包，中间踩了不少坑。分享出来希望对大家有帮助：不要一开始就买意大利Buttero皮料（太贵浪费）、菱斩一定要买好的（法式斜平斩）、封边不能急（每遍都要打磨到位）、线不要太粗（0.45mm最合适）、多看教程再动手。',
    images: [], topic: 'newbie', tags: ['皮具', '避坑', '新手经验'],
    author: authors.u12, likes_count: 456, comments_count: 32, favorites_count: 156, is_liked: true, is_favorited: false,
    process_steps: [
      { title: '工具准备', description: '核心6件工具花了约350元，其中菱斩占了一半预算。' },
      { title: '第一个卡包', description: '花了2小时做了极简卡包，虽然边缘粗糙但能用。' },
      { title: '总结经验', description: '封边是最难的部分，需要极大的耐心。一急就报废。' },
    ],
    materials_used: [{ name: '植鞣皮(1.5mm)', slug: 'italian-vegetable-leather' }, { name: '法式麻蜡线', slug: null }],
    related_tutorial_slugs: ['mini-leather-cardholder'],
    created_at: '2026-05-24',
  },
  {
    id: 'p3', slug: 'wooden-spoon-collection', title: '木勺雕刻入坑一个月作品集合',
    content: '从第一个歪歪扭扭的勺子到现在能做出比较像样的造型了。木头真是越刻越上瘾，周末泡在阳台一整天都不觉得累。分享这一个月做的5把勺子。',
    images: [], topic: 'showcase', tags: ['木工', '木勺', '成长记录'],
    author: authors.u13, likes_count: 189, comments_count: 22, favorites_count: 67, is_liked: false, is_favorited: false,
    process_steps: [
      { title: '材料选择', description: '前三把用椴木（练习），后面用樱桃木（作品）。樱桃木真的美太多了。' },
      { title: '工具进化', description: '从一把雕刻刀到买了弯头刀+直刀+砂纸套装。' },
    ],
    materials_used: [{ name: '樱桃木雕刻料', slug: 'cherry-wood-carving' }, { name: '椴木', slug: 'basswood-carving' }],
    related_tutorial_slugs: ['wooden-spoon-carving'],
    created_at: '2026-05-23',
  },
  {
    id: 'p4', slug: 'dmc-thread-review', title: '花了500块买了DMC全线基础色，值不值？',
    content: '入坑刺绣第三周，在淘宝上看到DMC绣线越看越想买。最后狠心花了500块买了30个基础色。今天做一个全方位的测评：DMC vs 国产绣线，从光泽度、色牢固、手感三个维度对比。结论：贵的确实有贵的道理...',
    images: [], topic: 'review', tags: ['刺绣', 'DMC', '材料测评', '对比'],
    author: authors.u14, likes_count: 567, comments_count: 45, favorites_count: 203, is_liked: false, is_favorited: true,
    process_steps: [
      { title: '购买决策', description: '纠结了一周，最终在DMC旗舰店下单30色基础套装。' },
      { title: '对比测试', description: '从光泽度、色牢固（水洗测试）、手感三个维度对比DMC和国产线。' },
      { title: '最终结论', description: '日常练习国产线够用，但送礼/参赛作品必须DMC。差距肉眼可见。' },
    ],
    materials_used: [{ name: 'DMC法国刺绣线', slug: 'dmc-embroidery-thread' }],
    related_tutorial_slugs: ['french-embroidery-brooch'],
    created_at: '2026-05-22',
  },
  {
    id: 'p5', slug: 'embroidered-fan-showcase', title: '法式刺绣团扇完成！绣了整整两个周末',
    content: '耗时约20小时完成了这把刺绣团扇。图案是自己设计的小雏菊和蝴蝶，用了链绣、缎面绣和法式结粒绣。虽然眼睛快瞎了但成品真的太美了！已经挂在卧室墙上了。',
    images: [], topic: 'showcase', tags: ['刺绣', '团扇', '法式刺绣', '装饰'],
    author: authors.u16, likes_count: 345, comments_count: 18, favorites_count: 120, is_liked: true, is_favorited: false,
    process_steps: [
      { title: '设计图案', description: '在草稿纸上画了3版才定稿，选了最简单的小雏菊图案。' },
      { title: '配色方案', description: '用了DMC的469/470/471三个绿色做渐变叶片。' },
    ],
    materials_used: [{ name: 'DMC法国刺绣线', slug: 'dmc-embroidery-thread' }, { name: '亚麻刺绣底布', slug: 'linen-fabric-embroidery' }],
    related_tutorial_slugs: ['french-embroidery-brooch', 'suzhou-embroidery-fan'],
    created_at: '2026-05-20',
  },
  {
    id: 'p6', slug: 'swallowtail-jewelry-box', title: '燕尾榫首饰盒终于完工了！历时一个月',
    content: '断断续续做了一个月的燕尾榫首饰盒，胡桃木配枫木的对比色。最难的是燕尾榫的角度和配合，返工了好几次，但做出来的成就感无与伦比。这种传统榫卯手艺真的值得传承。',
    images: [], topic: 'showcase', tags: ['木工', '榫卯', '首饰盒', '高级木艺'],
    author: authors.u18, likes_count: 420, comments_count: 25, favorites_count: 167, is_liked: true, is_favorited: true,
    process_steps: [
      { title: '材料选择', description: '胡桃木做盒身、枫木做盒盖，对比色搭配非常高级。' },
      { title: '燕尾榫制作', description: '最难的部分。锯了废了3块料才做出满意的燕尾榫角度。' },
      { title: '表面处理', description: '桐油涂了3遍，每一遍等24小时干透再打磨。' },
    ],
    materials_used: [],
    related_tutorial_slugs: [],
    created_at: '2026-05-18',
  },
  {
    id: 'p7', slug: 'clay-succulent-fail', title: '黏土多肉翻车现场——求指导！',
    content: '看着教程觉得好简单，结果自己做出来完全不像是多肉...颜色调得太绿了，叶片也太厚了。大家帮我看看问题出在哪？已经准备好重新做一次了。',
    images: [], topic: 'newbie', tags: ['黏土', '翻车', '求助', '多肉'],
    author: authors.u10, likes_count: 98, comments_count: 28, favorites_count: 12, is_liked: false, is_favorited: false,
    process_steps: [],
    materials_used: [{ name: '软陶泥 Fimo', slug: 'polymer-clay-fimo' }],
    related_tutorial_slugs: ['polymer-clay-succulent'],
    created_at: '2026-05-17',
  },
  {
    id: 'p8', slug: 'weaving-material-compare', title: '编织用藤条全面对比：印尼vs国产vs竹篾',
    content: '花了三个月，把市面上能买到的藤条都试了一遍。从5元/斤的竹篾到120元/kg的印尼藤，详细对比柔韧性、色泽、纤维细腻度、易用性四个维度。印尼藤确实是最好的，但国产优质藤性价比最高。',
    images: [], topic: 'review', tags: ['编织', '藤条', '材料测评', '深度对比'],
    author: authors.u19, likes_count: 678, comments_count: 52, favorites_count: 289, is_liked: false, is_favorited: false,
    process_steps: [
      { title: '采样阶段', description: '买了5种不同产地和价位的藤条做对比。' },
      { title: '测试方法', description: '每种藤条编织一个同样的杯垫，对比编织难度和成品效果。' },
    ],
    materials_used: [{ name: '天然印尼藤条(3mm)', slug: 'natural-rattan' }, { name: '纸藤', slug: 'paper-rattan-alternative' }],
    related_tutorial_slugs: ['beginner-weaving-basket'],
    created_at: '2026-05-15',
  },
  {
    id: 'p9', slug: 'vegetable-leather-patina', title: '植鞣皮钱包使用一年养色记录',
    content: '记录了我的Buttero皮短夹从全新到使用一年的颜色变化。从浅肉色→蜜糖色→深棕色，每一道划痕都成了独一无二的记忆。这就是植鞣皮的魅力——它会随着你的使用变得独一无二。',
    images: [], topic: 'showcase', tags: ['皮具', '养色', '植鞣皮', 'Buttero'],
    author: authors.u23, likes_count: 890, comments_count: 56, favorites_count: 312, is_liked: true, is_favorited: true,
    process_steps: [
      { title: '初始状态', description: '一年前刚做好时，颜色是浅肉色，皮面光滑无痕。' },
      { title: '3个月', description: '开始变深，常用部位出现蜜糖色。' },
      { title: '6个月', description: '整体呈现均匀的蜜糖色，表面有了温润的光泽。' },
      { title: '12个月', description: '深棕色，每一道划痕都成了故事。颜色还会继续变深。' },
    ],
    materials_used: [{ name: '意大利植鞣皮(Buttero)', slug: 'italian-vegetable-leather' }],
    related_tutorial_slugs: ['handmade-leather-wallet'],
    created_at: '2026-05-10',
  },
  {
    id: 'p10', slug: 'may-challenge-announce', title: '【活动】五月手作打卡挑战开始报名！',
    content: '五月的打卡挑战来啦！规则：每天至少30分钟手作时间，在小程序打卡上传照片。坚持21天可获得"匠心初现"勋章！还有材料包奖品等着你~',
    images: [], topic: 'activity', tags: ['活动', '打卡挑战', '勋章', '奖品'],
    author: authors.u0, likes_count: 1023, comments_count: 89, favorites_count: 456, is_liked: true, is_favorited: false,
    process_steps: [],
    materials_used: [],
    related_tutorial_slugs: [],
    created_at: '2026-05-01',
  },
  {
    id: 'p11', slug: 'leather-tool-guide', title: '皮具入门工具避坑：什么该买什么不该买',
    content: '入坑皮具最纠结的就是买工具。网上套装从99到999都有。我花了一个月研究，总结出一份"必买清单"和"不用急着买清单"。结论：不要买套装！核心6件工具分开买，总共350元搞定。',
    images: [], topic: 'newbie', tags: ['皮具', '工具', '避坑指南', '新手'],
    author: authors.u12, likes_count: 234, comments_count: 19, favorites_count: 98, is_liked: false, is_favorited: false,
    process_steps: [
      { title: '必买6件', description: '菱斩(法式斜平斩)+手缝针×2+麻蜡线+削薄刀+打磨棒+封边液。' },
      { title: '不用急着买', description: '削薄机、烫边机、皮雕工具——等你基础作品做熟了再考虑。' },
    ],
    materials_used: [{ name: '皮具新手工具套装', slug: 'leather-craft-tools' }],
    related_tutorial_slugs: ['mini-leather-cardholder'],
    created_at: '2026-04-28',
  },
]

export const communityComments: CommunityComment[] = [
  { id: 'c1', postSlug: 'first-rattan-basket', author: { id: 'u1', nickname: '小藤匠', avatar_url: null }, content: '做得非常棒！第一个作品能有这个水平很厉害了。收口可以再用钳子夹紧一点会更好看。加油！', created_at: '2026-05-25', parent_id: null },
  { id: 'c2', postSlug: 'first-rattan-basket', author: { id: 'u10', nickname: '手工小白', avatar_url: null }, content: '谢谢老师！下次会注意收口的。已经准备做第二个篮子了~', created_at: '2026-05-25', parent_id: 'c1' },
  { id: 'c3', postSlug: 'leather-cardholder-first', author: { id: 'u2', nickname: '皮匠老李', avatar_url: null }, content: '总结得很到位！特别是菱斩那一条，便宜斩害了多少新手。', created_at: '2026-05-24', parent_id: null },
  { id: 'c4', postSlug: 'swallowtail-jewelry-box', author: { id: 'u3', nickname: '木语人', avatar_url: null }, content: '燕尾榫角度做得很标准了。胡桃木配枫木是经典搭配，高级。', created_at: '2026-05-18', parent_id: null },
  { id: 'c5', postSlug: 'dmc-thread-review', author: { id: 'u5', nickname: '绣绣子', avatar_url: null }, content: 'DMC确实贵但确实好。建议新手先买几个常用色号，后面按需补。', created_at: '2026-05-22', parent_id: null },
  { id: 'c6', postSlug: 'vegetable-leather-patina', author: { id: 'u2', nickname: '皮匠老李', avatar_url: null }, content: '养得真好！颜色很均匀，说明平时使用习惯好。Buttero的变色效果果然是顶级的。', created_at: '2026-05-10', parent_id: null },
  { id: 'c7', postSlug: 'clay-succulent-fail', author: { id: 'u4', nickname: '泥巴匠', avatar_url: null }, content: '颜色太绿了，多肉带点粉调和灰调。叶片可以再薄一点，尖端微微上翘就对了。', created_at: '2026-05-17', parent_id: null },
  { id: 'c8', postSlug: 'may-challenge-announce', author: { id: 'u10', nickname: '手工小白', avatar_url: null }, content: '已报名！上个月坚持了15天，这个月要冲21天拿勋章！', created_at: '2026-05-02', parent_id: null },
]

export const creators: Creator[] = [
  { id: 'cr1', author: { id: 'u4', nickname: '泥巴匠', avatar_url: null }, specialty: '黏土手办', works_count: 56, total_likes: 7890, bio: '黏土手办原型师，擅长Q版人物和萌宠' },
  { id: 'cr2', author: { id: 'u5', nickname: '绣绣子', avatar_url: null }, specialty: '法式刺绣', works_count: 38, total_likes: 5670, bio: '传统苏绣+现代法式刺绣双修' },
  { id: 'cr3', author: { id: 'u1', nickname: '小藤匠', avatar_url: null }, specialty: '藤编', works_count: 45, total_likes: 5680, bio: '10年藤编经验，专注天然材料编织' },
  { id: 'cr4', author: { id: 'u2', nickname: '皮匠老李', avatar_url: null }, specialty: '手工皮具', works_count: 32, total_likes: 4320, bio: '专注手工皮具制作8年，擅长植鞣皮和皮雕' },
  { id: 'cr5', author: { id: 'u3', nickname: '木语人', avatar_url: null }, specialty: '木艺雕刻', works_count: 28, total_likes: 3890, bio: '独立木艺设计师，传统榫卯技艺传承' },
  { id: 'cr6', author: { id: 'u23', nickname: '养皮人', avatar_url: null }, specialty: '皮具养色', works_count: 15, total_likes: 2100, bio: '专注植鞣皮养色记录，分享皮具日常使用之美' },
]

export const challenges: Challenge[] = [
  { id: 'ch1', title: '30天编织挑战', description: '每天完成一件小编织作品，坚持30天！', icon: '🧶', participants: 234, end_date: '2026-06-30' },
  { id: 'ch2', title: '夏日木艺创作', description: '用木头创作一件夏日主题的作品', icon: '🪵', participants: 156, end_date: '2026-07-15' },
]

export const topics = [
  { slug: 'showcase', name: '成品展示', icon: '🎨', description: '展示你的手作作品，让更多人看到' },
  { slug: 'newbie', name: '新手避坑', icon: '🔰', description: '新手经验分享，一起成长' },
  { slug: 'review', name: '材料测评', icon: '📊', description: '工具和材料的真实使用体验' },
  { slug: 'activity', name: '活动专区', icon: '🎪', description: '线上活动和挑战赛事' },
]

export function getPostBySlug(slug: string): CommunityPost | undefined {
  return communityPosts.find((p) => p.slug === slug)
}

export function getPostsByTopic(topic: string): CommunityPost[] {
  if (topic === 'all') return communityPosts
  return communityPosts.filter((p) => p.topic === topic)
}
