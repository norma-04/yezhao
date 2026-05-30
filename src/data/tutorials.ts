// ─── 野造 · 教程模拟数据 ───
import type { Tutorial, TutorialStep, MaterialItem, Author } from '@/lib/types'

const authors: Record<string, Author> = {
  u1: { id: 'u1', nickname: '小藤匠', avatar_url: null },
  u2: { id: 'u2', nickname: '皮匠老李', avatar_url: null },
  u3: { id: 'u3', nickname: '木语人', avatar_url: null },
  u4: { id: 'u4', nickname: '泥巴匠', avatar_url: null },
  u5: { id: 'u5', nickname: '绣绣子', avatar_url: null },
  u6: { id: 'u6', nickname: '皮小新', avatar_url: null },
}

export const allTutorials: Tutorial[] = [
  {
    id: 'beginner-weaving-basket', title: '初学者藤编收纳篮', slug: 'beginner-weaving-basket',
    cover_url: null, video_url: null, category: 'weaving', difficulty: 'beginner',
    duration_minutes: 45, description: '从零开始学习藤编基础技法，完成一个实用又美观的收纳篮。从材料准备到成品完成，每一步都有详细讲解。',
    author: authors.u1, favorites_count: 1234, learners_count: 8900, status: 'published',
    created_at: '2026-05-15', updated_at: '2026-05-15',
    steps: [
      { id: 's1', order: 1, title: '准备材料与工具', description: '准备好藤条、剪刀、钳子、水盆。将藤条浸泡30分钟使其柔软易编。选择3mm印尼藤条效果最佳。', image_url: null },
      { id: 's2', order: 2, title: '编织底部', description: '用十字交叉法编织篮子底部，注意保持藤条间距均匀。底部直径约20cm，编织时保持藤条湿润但不要滴水。', image_url: null },
      { id: 's3', order: 3, title: '立起侧边藤条', description: '将底部周围的藤条向上折起90度，用细藤条缠绕固定第一圈。这是最关键的一步，侧边藤条必须保持垂直。', image_url: null },
      { id: 's4', order: 4, title: '编织篮身', description: '采用一上一下的基础编织法，逐圈向上编织。每编完一圈要压紧，让篮身紧密结实。', image_url: null },
      { id: 's5', order: 5, title: '收口处理', description: '编到合适高度后（约15cm），将藤条端头向内折入，用钳子夹紧固定。注意收口要平整美观。', image_url: null },
      { id: 's6', order: 6, title: '制作提手', description: '可选：用粗藤条或皮绳制作提手，固定在篮子两侧。提手要结实耐用。', image_url: null },
      { id: 's7', order: 7, title: '修整打磨', description: '修剪多余的藤条末端，用细砂纸打磨粗糙处。检查整体造型是否均匀对称。', image_url: null },
      { id: 's8', order: 8, title: '上油保护', description: '涂刷木蜡油保护藤编，延长使用寿命。放在通风处晾干24小时即可使用。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '天然藤条(3mm)', amount: '约50米', note: '选择柔韧性好的印尼藤，新手首选', purchase_url: '/materials/mat1' },
      { id: 'm2', name: '编织剪刀', amount: '1把', note: '锋利即可，不需要特别专业的', purchase_url: null },
      { id: 'm3', name: '尖嘴钳', amount: '1把', note: '用于夹紧藤条和固定收口', purchase_url: null },
      { id: 'm4', name: '水盆', amount: '1个', note: '浸泡藤条用，普通水盆即可', purchase_url: null },
      { id: 'm5', name: '木蜡油', amount: '适量', note: '保护藤编成品，延长使用寿命', purchase_url: '/materials/mat2' },
    ],
    notes: ['藤条浸泡时间不宜过长，30分钟即可', '编织时保持藤条湿润但不要滴水', '初学者建议选择3mm藤条，太粗难弯曲', '收口是难点，多练习几次就会了'],
  },
  {
    id: 'handmade-leather-wallet', title: '手工植鞣皮短夹', slug: 'handmade-leather-wallet',
    cover_url: null, video_url: null, category: 'leather', difficulty: 'intermediate',
    duration_minutes: 120, description: '用意大利植鞣皮制作一个经典款短夹，包含卡位和钞位设计。适合有一定皮具基础的手作爱好者。',
    author: authors.u2, favorites_count: 892, learners_count: 4500, status: 'published',
    created_at: '2026-05-10', updated_at: '2026-05-10',
    steps: [
      { id: 's1', order: 1, title: '设计裁皮', description: '按照图纸裁切皮料，包括外皮、内里、卡位片。预留5mm缝份。使用Buttero植鞣皮1.5mm厚度。', image_url: null },
      { id: 's2', order: 2, title: '削薄边缘', description: '用削薄刀将皮料边缘削薄至1mm，方便后续折边和缝制。这一步做得好，成品边缘才会薄而精致。', image_url: null },
      { id: 's3', order: 3, title: '处理床面', description: '用CMC处理剂涂抹皮料背面，用打磨棒打磨光滑。床面处理是皮具制作的基本功。', image_url: null },
      { id: 's4', order: 4, title: '打斩缝线', description: '用菱斩打孔（3.38mm间距），双针法缝制卡位层。线迹要均匀美观，拉线力度保持一致。', image_url: null },
      { id: 's5', order: 5, title: '组装卡位', description: '将各卡位层叠加缝合，注意对齐。卡位的顺序和方向要仔细确认。', image_url: null },
      { id: 's6', order: 6, title: '缝合外皮', description: '将卡位内里与外皮缝合，转角处要特别小心处理。', image_url: null },
      { id: 's7', order: 7, title: '打磨边缘', description: '用砂纸从粗到细逐级（400→800→1200→2000目）打磨边缘至光滑。', image_url: null },
      { id: 's8', order: 8, title: '封边处理', description: '用封边液涂抹边缘，用打磨棒反复打磨至镜面效果。封边是慢工出细活，每遍都要打磨到位。', image_url: null },
      { id: 's9', order: 9, title: '安装五金', description: '根据需要安装按扣或其他五金件。五金件的安装位置要精确。', image_url: null },
      { id: 's10', order: 10, title: '上油保养', description: '涂抹貂油保养皮面，让皮料呈现自然光泽。养护得当的植鞣皮会越用越美。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '意大利植鞣皮(1.5mm)', amount: '0.3平方米', note: '推荐Buttero或Minerva Box', purchase_url: '/materials/mat3' },
      { id: 'm2', name: '麻蜡线(0.45mm)', amount: '约5米', note: '颜色搭配皮料，建议同色系深一调', purchase_url: '/materials/mat4' },
      { id: 'm3', name: '菱斩(3.38mm间距)', amount: '1套', note: '法式斜平斩更美观', purchase_url: null },
      { id: 'm4', name: '手缝针', amount: '2根', note: '钝头手缝针，不会扎手', purchase_url: null },
      { id: 'm5', name: '削薄刀', amount: '1把', note: '或使用削薄机效率更高', purchase_url: null },
      { id: 'm6', name: 'CMC处理剂', amount: '1瓶', note: '用于床面处理', purchase_url: null },
      { id: 'm7', name: '封边液', amount: '1瓶', note: '选择哑光质感更高级', purchase_url: null },
      { id: 'm8', name: '打磨棒+砂纸套装', amount: '1套', note: '400-2000目砂纸', purchase_url: null },
    ],
    notes: ['植鞣皮遇水会变色，制作时保持手部干燥', '菱斩打孔要垂直，否则线迹会歪斜', '封边液不要涂太多，薄薄一层即可', '法式斜平斩比普通菱斩打出的孔更美观'],
  },
  {
    id: 'wooden-spoon-carving', title: '入门木勺雕刻', slug: 'wooden-spoon-carving',
    cover_url: null, video_url: null, category: 'woodwork', difficulty: 'beginner',
    duration_minutes: 90, description: '用一块木料雕刻一把属于自己的木勺。体验木工基础中的切削与打磨技法，感受木头的温度。',
    author: authors.u3, favorites_count: 2105, learners_count: 12300, status: 'published',
    created_at: '2026-05-08', updated_at: '2026-05-08',
    steps: [
      { id: 's1', order: 1, title: '选材画样', description: '选择一块无裂纹的樱桃木或椴木（约15×8×3cm），在木料上用铅笔画好勺子轮廓。椴木最软适合新手。', image_url: null },
      { id: 's2', order: 2, title: '粗削外形', description: '用雕刻刀或带锯沿轮廓线粗削出勺子外形。注意留一些余量，不要一次削到线。', image_url: null },
      { id: 's3', order: 3, title: '挖勺凹面', description: '用弯头雕刻刀挖出勺子凹面，深度约5-8mm。从中间开始向外挖，保持均匀。', image_url: null },
      { id: 's4', order: 4, title: '修整造型', description: '用直刀修整勺子外轮廓，调整勺柄的弧度和厚度。让握感更舒适。', image_url: null },
      { id: 's5', order: 5, title: '打磨抛光', description: '从80目到400目砂纸逐级打磨，先粗后细。最后用棉布抛光至光滑。', image_url: null },
      { id: 's6', order: 6, title: '上油养护', description: '涂抹食品级矿物油或核桃油，静置24小时充分吸收。可重复涂2-3次。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '椴木或樱桃木料', amount: '1块(15×8×3cm)', note: '椴木最软适合入门，樱桃木纹理更美', purchase_url: '/materials/mat5' },
      { id: 'm2', name: '雕刻刀套装', amount: '1套', note: '至少需要弯头刀和直刀各一把', purchase_url: null },
      { id: 'm3', name: '砂纸组合', amount: '80/120/240/400目', note: '各一张即可', purchase_url: null },
      { id: 'm4', name: '食品级矿物油', amount: '适量', note: '保护木器，安全无毒可接触食物', purchase_url: null },
    ],
    notes: ['雕刻时注意刀锋方向，避免逆纹雕刻导致撕裂', '初学者建议选软木类（椴木、樱桃木）', '打磨要耐心，从粗到细逐级进行', '矿物油比食用油更稳定不会变质'],
  },
  {
    id: 'polymer-clay-succulent', title: '软陶多肉植物盆栽', slug: 'polymer-clay-succulent',
    cover_url: null, video_url: null, category: 'clay', difficulty: 'beginner',
    duration_minutes: 60, description: '用软陶泥制作一盆可爱的多肉植物，不需要浇水也不会枯萎的治愈系小盆栽。适合零基础入门。',
    author: authors.u4, favorites_count: 1567, learners_count: 7800, status: 'published',
    created_at: '2026-05-05', updated_at: '2026-05-05',
    steps: [
      { id: 's1', order: 1, title: '调色准备', description: '取白色软陶泥，加入绿色和粉色油彩调出多肉渐变色的泥料。少量多次加入颜料。', image_url: null },
      { id: 's2', order: 2, title: '制作叶片', description: '将泥料搓成水滴状小粒，压扁后捏出多肉叶片的形状，尖端可微微上翘。', image_url: null },
      { id: 's3', order: 3, title: '组合花型', description: '由内向外逐层粘贴叶片，内层叶片小而紧凑，外层舒展。注意对称。', image_url: null },
      { id: 's4', order: 4, title: '制作花盆', description: '用棕色泥料做一个迷你陶盆，可用牙签刻画纹理增加真实感。', image_url: null },
      { id: 's5', order: 5, title: '烘烤定型', description: '放入烤箱120°C烘烤15分钟（按泥料说明调整温度和时间）。冷却后完成。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '软陶泥(白色)', amount: '200g', note: '基础色，可自行调出各种颜色', purchase_url: null },
      { id: 'm2', name: '油彩颜料', amount: '绿/粉/棕各少许', note: '调色用，建议用软陶专用颜料', purchase_url: null },
      { id: 'm3', name: '塑形工具', amount: '1套', note: '含丸棒、塑形刀、纹理针', purchase_url: null },
      { id: 'm4', name: '亮光油', amount: '1瓶', note: '增加多肉光泽感，让作品更逼真', purchase_url: null },
    ],
    notes: ['烘烤温度不要超过泥料标示温度，否则会烧焦', '调色时少量多次加入颜料，颜色更容易控制', '叶片粘贴时轻轻按压即可，太用力会变形', '不同品牌软陶泥烘烤温度不同，先阅读说明'],
  },
  {
    id: 'french-embroidery-brooch', title: '法式刺绣入门：叶片胸针', slug: 'french-embroidery-brooch',
    cover_url: null, video_url: null, category: 'embroidery', difficulty: 'beginner',
    duration_minutes: 75, description: '学习法式刺绣的基础针法，完成一枚精致的叶片造型胸针。包含链绣、缎面绣、轮廓绣和法式结粒绣。',
    author: authors.u5, favorites_count: 987, learners_count: 5600, status: 'published',
    created_at: '2026-05-01', updated_at: '2026-05-01',
    steps: [
      { id: 's1', order: 1, title: '拓图准备', description: '将叶片图案拓印到绣布上，绷好绣绷。选择渐变色的绣线：从深绿到浅绿3-4色。', image_url: null },
      { id: 's2', order: 2, title: '轮廓绣描边', description: '用轮廓绣沿叶片边缘绣一圈，勾勒出叶片形状。轮廓绣是最基础的针法。', image_url: null },
      { id: 's3', order: 3, title: '缎面绣填充', description: '用缎面绣填充叶片主体，绣线排列要紧密均匀。从叶尖向叶柄方向绣。', image_url: null },
      { id: 's4', order: 4, title: '链绣叶脉', description: '用链绣绣出叶片主脉和侧脉纹路，让叶片更立体。', image_url: null },
      { id: 's5', order: 5, title: '法式结粒绣', description: '在叶片边缘点缀法式结粒绣，模拟露珠效果。法式结粒绣是重点针法，建议先在废布上练习。', image_url: null },
      { id: 's6', order: 6, title: '安装胸针底座', description: '在背面缝上胸针底座，修剪边缘留2mm。你的第一枚刺绣胸针完成了！', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '绣布(米白色)', amount: '15×15cm', note: '推荐亚麻或棉麻混纺', purchase_url: null },
      { id: 'm2', name: 'DMC绣线', amount: '3-4色各1束', note: '绿色系渐变色，推荐469/470/471/472', purchase_url: '/materials/mat6' },
      { id: 'm3', name: '绣绷(12cm)', amount: '1个', note: '直径12cm适合小型作品', purchase_url: null },
      { id: 'm4', name: '刺绣针', amount: '3根', note: '粗细不同的针适合不同线径', purchase_url: null },
      { id: 'm5', name: '胸针底座', amount: '1个', note: '25mm圆形底座即可', purchase_url: null },
    ],
    notes: ['绣线不要拉太紧，保持布面平整', '法式结粒绣是核心针法，建议先在废布上练10个', '绣绷要绷紧才能绣出平整的作品', 'DMC绣线可以拆分成不同股数使用'],
  },
  {
    id: 'rattan-tote-bag', title: '进阶藤编手提包', slug: 'rattan-tote-bag',
    cover_url: null, video_url: null, category: 'weaving', difficulty: 'advanced',
    duration_minutes: 240, description: '学习复杂藤编技法，编织一个时尚的手提包。包含绞编、锁边等进阶技巧，需要一定的藤编基础。',
    author: authors.u1, favorites_count: 456, learners_count: 1800, status: 'published',
    created_at: '2026-04-28', updated_at: '2026-04-28',
    steps: [
      { id: 's1', order: 1, title: '设计制图', description: '绘制提包设计图，确定尺寸（约30×20×10cm）和编织纹样。主筋位置要精确标注。', image_url: null },
      { id: 's2', order: 2, title: '材料预处理', description: '藤条浸泡45分钟，按设计图裁剪主筋（5mm粗藤）和编织藤（2mm细藤）。', image_url: null },
      { id: 's3', order: 3, title: '编织包底', description: '采用双层编织法制作承重包底，确保底部结实耐用。', image_url: null },
      { id: 's4', order: 4, title: '绞编包身', description: '使用双藤绞编技法编织包身。绞编比平编更结实，视觉效果也更有层次。', image_url: null },
      { id: 's5', order: 5, title: '图案编织', description: '在包身中段加入彩色藤条编织装饰图案，可以是几何纹样或渐变色带。', image_url: null },
      { id: 's6', order: 6, title: '锁边收口', description: '使用三股锁边法对包口进行锁边处理，让包口结实不变形。', image_url: null },
      { id: 's7', order: 7, title: '内衬安装', description: '裁剪棉布制作内衬，缝上内袋和拉链，将内衬缝入藤编包内。', image_url: null },
      { id: 's8', order: 8, title: '提手制作安装', description: '编织一对圆柱形提手，内部加钢丝支撑增强承重，牢固固定在包身。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '天然藤条(2mm)', amount: '约100米', note: '编织用细藤', purchase_url: '/materials/mat1' },
      { id: 'm2', name: '天然藤条(5mm)', amount: '约20米', note: '主筋用粗藤', purchase_url: '/materials/mat1' },
      { id: 'm3', name: '彩色藤条', amount: '约10米', note: '装饰图案用，选对比色', purchase_url: null },
      { id: 'm4', name: '棉布内衬', amount: '0.5米', note: '米白色纯棉布', purchase_url: null },
      { id: 'm5', name: '钢丝(3mm)', amount: '约40cm', note: '提手支撑，五金店有售', purchase_url: null },
    ],
    notes: ['绞编时力度要均匀，松紧不一会影响包型', '内衬尺寸要略小于包身外部尺寸', '提手安装务必牢固，建议加金属铆钉加固', '完成时间约4小时，建议分两天制作'],
  },
  {
    id: 'leather-carving-wallet', title: '手工皮雕唐草纹长夹', slug: 'leather-carving-wallet',
    cover_url: null, video_url: null, category: 'leather', difficulty: 'advanced',
    duration_minutes: 300, description: '学习传统皮雕技法，从打湿皮料到上色完成，制作一个精美的唐草纹雕花长夹。需要皮具基础。',
    author: authors.u2, favorites_count: 345, learners_count: 1200, status: 'published',
    created_at: '2026-04-25', updated_at: '2026-04-25',
    steps: [
      { id: 's1', order: 1, title: '设计图稿转印', description: '绘制唐草纹样，用水将图案转印到打湿的植鞣皮上。图案的对称性和流畅度很重要。', image_url: null },
      { id: 's2', order: 2, title: '刀线切割', description: '用旋转刻刀沿图案线条切割，深度约皮厚的1/3。这是皮雕最重要的基本功。', image_url: null },
      { id: 's3', order: 3, title: '敲打背景', description: '用背景印花工具敲低背景区域，让图案从背景中凸显出来。', image_url: null },
      { id: 's4', order: 4, title: '浮雕塑形', description: '用各种印花工具对图案进行浮雕处理，花瓣、叶片的层次感主要通过这一步完成。', image_url: null },
      { id: 's5', order: 5, title: '上色处理', description: '用酒精染料进行渐变上色，先浅后深，突出立体感和层次。', image_url: null },
      { id: 's6', order: 6, title: '组装缝合', description: '裁切各部件，打斩缝合。将卡位内里与雕花外皮精确缝合。', image_url: null },
      { id: 's7', order: 7, title: '封边完成', description: '精细封边打磨至镜面效果，安装五金扣具。一个皮雕长夹就完成了。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '意大利植鞣皮(2.0mm)', amount: '0.5平方米', note: '外皮用，需要足够厚度承载雕刻', purchase_url: '/materials/mat3' },
      { id: 'm2', name: '旋转刻刀', amount: '1把', note: '皮雕核心工具，建议购买中等价位的', purchase_url: null },
      { id: 'm3', name: '印花工具套装', amount: '1套', note: '含背景、花瓣、叶脉、边框等印花', purchase_url: null },
      { id: 'm4', name: '酒精染料', amount: '若干色', note: 'Fiebings Pro Dye 推荐品牌', purchase_url: null },
    ],
    notes: ['皮雕关键在于皮料湿度，太湿太干都不行', '旋转刻刀要始终保持锋利', '上色从浅到深逐步叠加，不可一次涂太深', '皮雕是高级技法，建议先完成基础皮具教程再尝试'],
  },
  {
    id: 'clay-figure-tutorial', title: '黏土Q版人物手办', slug: 'clay-figure-tutorial',
    cover_url: null, video_url: null, category: 'clay', difficulty: 'intermediate',
    duration_minutes: 150, description: '学习石塑黏土的塑形技法，用铝丝骨架制作一个可爱的Q版人物手办。从骨架到上色完整教学。',
    author: authors.u4, favorites_count: 1230, learners_count: 4300, status: 'published',
    created_at: '2026-04-18', updated_at: '2026-04-18',
    steps: [
      { id: 's1', order: 1, title: '设计草图与骨架', description: '画出Q版人物草图（约2.5头身比例），用铝丝制作人物骨架并固定在底座上。', image_url: null },
      { id: 's2', order: 2, title: '躯干塑形', description: '用石塑黏土包裹骨架，捏出躯干和四肢的基本形状。注意Q版人物的比例特征。', image_url: null },
      { id: 's3', order: 3, title: '头部与五官', description: '捏制头部，用工具刻画五官。Q版人物的眼睛要大而圆，鼻子小而精致。', image_url: null },
      { id: 's4', order: 4, title: '服饰细节', description: '用薄黏土片制作服装，添加褶皱和装饰。可以用纹理工具做出布料质感。', image_url: null },
      { id: 's5', order: 5, title: '干燥打磨上色', description: '自然干燥48小时后细砂纸打磨，再用丙烯颜料上色。最后喷消光保护漆。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '石塑黏土(LaDoll)', amount: '500g', note: '纤维细腻，干燥后坚硬可打磨', purchase_url: '/materials/mat10' },
      { id: 'm2', name: '铝丝(1.5mm)', amount: '约50cm', note: '制作人物骨架', purchase_url: null },
      { id: 'm3', name: '塑形工具套装', amount: '1套', note: '含塑形刀、丸棒、纹理针', purchase_url: null },
      { id: 'm4', name: '丙烯颜料12色', amount: '1套', note: '肤色需要自己调配', purchase_url: null },
      { id: 'm5', name: '消光保护漆', amount: '1罐', note: '喷上后作品不反光更有质感', purchase_url: null },
    ],
    notes: ['黏土干燥会收缩5-8%，头部要做大一点', '每层黏土之间要充分结合，可用少量水湿润', '上色要薄涂多层，每层干透再涂下一层', '保护漆要在通风处使用，距离30cm喷涂'],
  },
  {
    id: 'suzhou-embroidery-fan', title: '苏绣双面绣团扇', slug: 'suzhou-embroidery-fan',
    cover_url: null, video_url: null, category: 'embroidery', difficulty: 'intermediate',
    duration_minutes: 180, description: '学习传统苏绣双面绣技艺，制作一把精美团扇。双面绣要求正反两面针脚都整齐美观。',
    author: authors.u5, favorites_count: 890, learners_count: 3100, status: 'published',
    created_at: '2026-04-15', updated_at: '2026-04-15',
    steps: [
      { id: 's1', order: 1, title: '设计选图与绷绢', description: '选择简单花朵图案，将绢料绷在团扇框上。图案不宜太复杂，适合双面绣练习。', image_url: null },
      { id: 's2', order: 2, title: '劈线描图', description: '将真丝绣线劈成所需粗细（一般劈1/2或1/4），用可消笔描出图案轮廓。', image_url: null },
      { id: 's3', order: 3, title: '齐针打底', description: '用齐针绣出花瓣的底色，注意正反面针脚都要整齐。双面绣的精髓在于正反一致。', image_url: null },
      { id: 's4', order: 4, title: '套针过渡', description: '用套针技法做出花瓣的渐变色过渡，这是苏绣最具特色的针法之一。', image_url: null },
      { id: 's5', order: 5, title: '细节补充装扇柄', description: '用滚针绣出轮廓线，花蕊用打籽绣。最后安装团扇手柄和流苏装饰。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '真丝绢料', amount: '30×30cm', note: '半透明为佳，双面可见', purchase_url: null },
      { id: 'm2', name: '真丝绣线', amount: '若干色', note: '苏州产为佳，光泽温润', purchase_url: '/materials/mat11' },
      { id: 'm3', name: '团扇框+手柄+流苏', amount: '1套', note: '直径约20cm', purchase_url: null },
      { id: 'm4', name: '刺绣针(9-12号)', amount: '若干', note: '细针适合丝线', purchase_url: null },
    ],
    notes: ['双面绣的难点在于正反面都要美观整齐', '劈线时用指甲沿线的捻度轻轻划开', '针脚要短而密，才能表现细腻的过渡', '建议先完成叶片胸针教程再学双面绣'],
  },
  {
    id: 'mini-leather-cardholder', title: '新手皮具：极简卡包', slug: 'mini-leather-cardholder',
    cover_url: null, video_url: null, category: 'leather', difficulty: 'beginner',
    duration_minutes: 40, description: '零基础也能做！用最简单的技法制作一个实用卡包，无需缝线只用铆钉固定。30分钟完成。',
    author: authors.u6, favorites_count: 1789, learners_count: 10200, status: 'published',
    created_at: '2026-05-20', updated_at: '2026-05-20',
    steps: [
      { id: 's1', order: 1, title: '裁切皮料', description: '按模板裁切一片皮料（约20×10cm），四角用圆角器处理。1.5mm厚度最合适。', image_url: null },
      { id: 's2', order: 2, title: '定位打孔', description: '在折叠线和两侧标记铆钉位置，用冲子打孔。左右各两个铆钉，间距均匀。', image_url: null },
      { id: 's3', order: 3, title: '安装铆钉', description: '折叠皮料，用铆钉安装工具将铆钉逐一固定。安装时用力要均匀。', image_url: null },
      { id: 's4', order: 4, title: '打磨上油', description: '用砂纸打磨边缘，涂上封边液。最后涂抹保养油，一个极简卡包就完成了！', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '植鞣皮(1.5mm)', amount: '20×10cm', note: '边角料即可，成本很低', purchase_url: '/materials/mat3' },
      { id: 'm2', name: '铆钉(6mm)', amount: '4颗', note: '铜色或银色均可', purchase_url: null },
      { id: 'm3', name: '铆钉安装工具', amount: '1套', note: '含冲子和安装底座', purchase_url: null },
      { id: 'm4', name: '封边液+保养油', amount: '各1瓶', note: '小瓶试用装即可', purchase_url: null },
    ],
    notes: ['皮料不要选太厚的，2mm以上折叠困难', '铆钉安装要居中，否则卡片会滑出', '这是最快完成的作品，非常适合建立信心', '可以尝试不同颜色的皮料做出系列'],
  },
  {
    id: 'macrame-wall-hanging', title: '编织挂毯入门', slug: 'macrame-wall-hanging',
    cover_url: null, video_url: null, category: 'weaving', difficulty: 'beginner',
    duration_minutes: 80, description: '用棉绳编织一面波西米亚风格挂毯，学习基础结法包括云雀结、平结和斜卷结。适合零基础。',
    author: authors.u1, favorites_count: 1890, learners_count: 9800, status: 'published',
    created_at: '2026-05-22', updated_at: '2026-05-22',
    steps: [
      { id: 's1', order: 1, title: '准备材料', description: '准备一根木棍（约50cm）和白色棉绳。棉绳选择3mm粗细，约100米用量。', image_url: null },
      { id: 's2', order: 2, title: '起头挂线', description: '用云雀结将棉绳均匀地挂在木棍上，每根绳长约2米。保证所有绳长一致。', image_url: null },
      { id: 's3', order: 3, title: '平结编织主体', description: '用平结编织挂毯主体部分，重复排列形成规整的纹理。这是挂毯最主要的编织技法。', image_url: null },
      { id: 's4', order: 4, title: '斜卷结图案', description: '用斜卷结编织出几何图案，可以是菱形、三角形等简单的图形。', image_url: null },
      { id: 's5', order: 5, title: '流苏处理', description: '底部留出流苏，修剪整齐。可以解开几根棉绳做出蓬松的流苏效果。', image_url: null },
      { id: 's6', order: 6, title: '装饰点缀', description: '加入木珠或彩色线装饰，让挂毯更有层次。最后修剪流苏至统一长度。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '棉绳(3mm)', amount: '约100米', note: '本白色为主，更百搭', purchase_url: null },
      { id: 'm2', name: '木棍', amount: '1根(50cm)', note: '直径约2cm，可在五金店购买', purchase_url: null },
      { id: 'm3', name: '木珠(可选)', amount: '若干', note: '装饰用，选自然木色', purchase_url: null },
    ],
    notes: ['棉绳长度要预留足够，宁长勿短', '编织时保持力度均匀，纹理才整齐', '流苏修剪可以先剪长一点再慢慢修短', '挂毯可以挂在卧室或客厅，很有成就感'],
  },
  {
    id: 'mini-food-clay', title: '黏土迷你美食摆件', slug: 'mini-food-clay',
    cover_url: null, video_url: null, category: 'clay', difficulty: 'beginner',
    duration_minutes: 50, description: '用树脂黏土制作可爱的迷你美食，可以做成冰箱贴或挂饰。快速上手，适合亲子一起动手。',
    author: authors.u4, favorites_count: 2340, learners_count: 11200, status: 'published',
    created_at: '2026-05-18', updated_at: '2026-05-18',
    steps: [
      { id: 's1', order: 1, title: '调色', description: '用树脂黏土调出食物的颜色。面包色=白+黄+棕，草莓色=白+红，生菜色=白+绿。', image_url: null },
      { id: 's2', order: 2, title: '制作主体', description: '捏出食物的基本形状：汉堡圆饼、甜甜圈圆环、冰淇淋球等。', image_url: null },
      { id: 's3', order: 3, title: '添加细节', description: '用工具刻画食物的纹理细节：汉堡的芝麻、面包的纹理。', image_url: null },
      { id: 's4', order: 4, title: '上色修饰', description: '用色粉或颜料加强立体感，模拟烘烤的颜色渐变。', image_url: null },
      { id: 's5', order: 5, title: '上光与磁铁', description: '涂亮光油做出食物光泽感，背面粘上磁铁片变成冰箱贴。', image_url: null },
    ],
    materials: [
      { id: 'm1', name: '树脂黏土', amount: '100g', note: 'Grace或Cosmos品牌，干燥后半透明', purchase_url: null },
      { id: 'm2', name: '丙烯颜料', amount: '基本色', note: '白/红/黄/绿/棕', purchase_url: null },
      { id: 'm3', name: '亮光油', amount: '1瓶', note: '让食物表面有光泽', purchase_url: null },
      { id: 'm4', name: '磁铁片(10mm)', amount: '若干', note: '粘在背面做冰箱贴', purchase_url: null },
    ],
    notes: ['树脂黏土干燥后会变半透明，调色时颜色要比目标色略浅', '亮光油要等黏土完全干燥后再涂', '可以做成便当、蛋糕、寿司等各种美食', '这个教程非常适合亲子活动'],
  },
]

// 辅助函数
export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return allTutorials.find((t) => t.slug === slug)
}

export function getTutorialsByCategory(category: string): Tutorial[] {
  if (category === 'all') return allTutorials
  return allTutorials.filter((t) => t.category === category)
}

export function getRelatedTutorials(tutorial: Tutorial, count = 4): Tutorial[] {
  return allTutorials
    .filter((t) => t.id !== tutorial.id && t.category === tutorial.category)
    .slice(0, count)
}

export function searchTutorials(query: string): Tutorial[] {
  const q = query.toLowerCase()
  return allTutorials.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.includes(q) ||
      t.author.nickname.includes(q)
  )
}
