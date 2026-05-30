// ─── 野造 · 材料知识库数据 ───
import type { Category } from '@/lib/types'

export interface MaterialData {
  id: string
  slug: string
  name: string
  category: Category
  image_url: string | null
  rating: number
  price_level: '¥' | '¥¥' | '¥¥¥' | '¥¥¥¥'
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  summary: string
  description: string
  characteristics: { label: string; value: string }[]
  pros: string[]
  cons: string[]
  buying_guide: { title: string; content: string; icon?: string }[]
  pitfalls: { mistake: string; consequence: string; solution: string }[]
  alternatives: {
    type: 'budget' | 'beginner' | 'premium' | 'eco'
    name: string
    description: string
    price: string
    pros: string[]
    cons: string[]
  }[]
  faqs: { question: string; answer: string }[]
  related_tutorial_slugs: string[]
  specs: string[]
  created_at: string
}

export const allMaterials: MaterialData[] = [
  // ─── 编织 ───
  {
    id: 'mat-1', slug: 'natural-rattan', name: '天然印尼藤条 (3mm)', category: 'weaving',
    image_url: null, rating: 4.8, price_level: '¥¥¥', difficulty_level: 'beginner',
    summary: '最常用的编织材料，柔韧性极佳，适合制作收纳篮、手提包等。',
    description: '印尼进口天然藤条是世界公认品质最好的编织材料。纤维细腻均匀，色泽自然浅黄，柔韧性出色。3mm是最通用的规格，既能编织精细的小物件，也能胜任中型收纳篮。浸泡30分钟后藤条柔软如丝，干燥后恢复硬度，成品结实耐用。',
    characteristics: [
      { label: '手感', value: '光滑细腻，无毛刺，编织时手感舒适' },
      { label: '柔韧性', value: '极佳，弯折90度不折断，适合各种造型' },
      { label: '色泽', value: '自然浅黄，随时间推移逐渐变深，有岁月感' },
      { label: '耐用性', value: '正确保养可用10年以上，越用越有味道' },
    ],
    pros: ['柔韧性业界最佳，编造型作品的首选', '色泽自然温暖，成品颜值高', '纤维细腻均匀，编织紧密美观', '耐久性强，正确保养可用数十年'],
    cons: ['价格较高（约80-120元/kg），不适合大量练习', '需要浸泡处理，准备工作耗时', '怕潮怕晒，需要上油保养', '供货不稳定，好品质的需要预订'],
    buying_guide: [
      { title: '看颜色', content: '优质藤条颜色均匀自然，呈浅黄色。颜色深浅不一或有黑斑的说明品质较差或存放不当。', icon: '🎨' },
      { title: '试柔韧', content: '取一段藤条弯折90度，好的藤条不会折断且能回弹。脆硬的藤条编织困难且成品易断裂。', icon: '🤸' },
      { title: '闻气味', content: '优质藤条有淡淡的植物清香。有霉味说明受潮发霉，坚决不能买。有刺鼻化学味说明经过漂白处理。', icon: '👃' },
      { title: '选规格', content: '3mm最通用，适合收纳篮和手提包。2mm适合精细编织。5mm以上适合做骨架和大型家具。新手从3mm开始。', icon: '📏' },
      { title: '品牌推荐', content: '印尼进口品牌"藤之语"和"自然藤艺"口碑较好。国产优质藤可以选"藤艺轩"，价格实惠品质稳定。', icon: '⭐' },
    ],
    pitfalls: [
      { mistake: '为了省钱买劣质竹篾当藤条用', consequence: '竹篾纤维粗、柔韧性差，编织过程中频繁断裂，成品粗糙不美观。', solution: '如果预算有限，可以先用纸藤（约12元/卷）练习基础技法，熟练后再升级天然藤条。' },
      { mistake: '买太粗的藤条（5mm+）', consequence: '新手很难驾驭粗藤条，弯折费劲容易伤手，编织出来的作品缝隙大不精致。', solution: '新手建议从2.5-3mm开始，手感适中容易上手，等熟练后再尝试粗藤。' },
      { mistake: '忽略浸泡环节', consequence: '干藤条直接编织会频繁断裂，而且无法做出流畅的曲线造型。', solution: '编织前用温水浸泡30分钟（太久了会泡烂），捞出沥干表面水分即可使用。' },
    ],
    alternatives: [
      { type: 'budget', name: '纸藤', description: '再生纸制作，颜色多样，手感柔软。适合新手练习和做装饰性编织。', price: '约8-15元/卷(50m)', pros: ['价格极低', '颜色丰富', '不需要浸泡'], cons: ['强度低', '怕水', '不适合承重作品'] },
      { type: 'beginner', name: '国产优质藤条', description: '国内产天然藤条，品质接近进口藤，性价比很高。', price: '约40-60元/kg', pros: ['性价比高', '购买方便', '品质稳定'], cons: ['柔韧性略逊进口藤', '颜色可能有差异'] },
      { type: 'premium', name: '印尼特级精选藤条', description: '手工挑选的顶级藤条，每一根都均匀完美。适合制作高端作品和送礼。', price: '约150-200元/kg', pros: ['每根完美', '色泽统一', '收藏级品质'], cons: ['价格昂贵', '需预订', '过度追求品质'] },
      { type: 'eco', name: '回收棉绳', description: '用回收棉布条替代藤条，独一无二的环保编织材料。', price: '几乎免费（旧衣物改造）', pros: ['零成本', '环保', '独特色彩'], cons: ['强度不稳定', '外观粗犷', '不适合精细作品'] },
    ],
    faqs: [
      { question: '藤条和竹篾有什么区别？', answer: '藤条是藤本植物的茎，柔韧有弹性；竹篾是竹子劈成的薄片，硬而脆。编织收纳篮、手提包等需要弯曲造型的作品必须用藤条，竹篾只适合做平面编织（如席子）。' },
      { question: '藤条怎么保存？', answer: '放在通风干燥处，避免阳光直射和潮湿。可以用布袋包裹（不要用塑料袋，会闷出霉）。编织前30分钟取出浸泡即可，不需要提前泡好存放。' },
      { question: '新手买多少藤条够用？', answer: '一个标准收纳篮（直径20cm×高15cm）大约需要50米3mm藤条。建议第一次买100米，够做2个篮子练习。' },
      { question: '藤条泡久了会坏吗？', answer: '浸泡超过2小时藤条会吸水过度变得松软无力，干燥后纤维容易断裂。严格控制在30分钟以内。' },
    ],
    related_tutorial_slugs: ['beginner-weaving-basket', 'rattan-tote-bag', 'macrame-wall-hanging'],
    specs: ['直径: 3mm', '长度: 约200米/kg', '材质: 天然藤本植物', '产地: 印尼/国产', '处理方式: 自然晾晒'],
    created_at: '2026-03-15',
  },
  {
    id: 'mat-2', slug: 'cotton-rope-macrame', name: '棉绳 (3mm Macrame专用)', category: 'weaving',
    image_url: null, rating: 4.6, price_level: '¥', difficulty_level: 'beginner',
    summary: 'Macrame编织的核心材料，柔软亲肤，适合挂毯、花篮、装饰品编织。',
    description: '3mm棉绳是Macrame（花边结编织）最核心的材料。100%纯棉材质，手感柔软亲肤，编织出的作品有波西米亚风格的温暖质感。本白色最百搭，也有染好色的彩色棉绳可选。棉绳比藤条更适合做挂毯、墙饰等装饰品，也适合完全没有编织经验的新手入门。',
    characteristics: [
      { label: '手感', value: '柔软亲肤，触感温暖，像摸毛衣一样舒服' },
      { label: '编织难度', value: '极低，不需要浸泡，拿起就能编' },
      { label: '作品风格', value: '波西米亚/北欧风，温柔治愈' },
      { label: '适用场景', value: '挂毯、花篮吊篮、杯垫、墙饰' },
    ],
    pros: ['价格极低，一卷几十块钱够做很多作品', '不需要预处理，开卷即用', '柔软不伤手，适合长时间编织', '成品蓬松温暖，装饰性极强'],
    cons: ['强度不如藤条，不能做承重作品', '白色容易脏，需要定期清洁', '怕水怕潮，不适合户外使用', '用久了会起毛球'],
    buying_guide: [
      { title: '选粗细', content: '3mm最通用，做挂毯和花篮都合适。2mm适合做精细的首饰。5mm适合做大件墙饰，视觉效果更蓬松。', icon: '📏' },
      { title: '选颜色', content: '本白色最百搭，适合任何风格。如果想要波西米亚风，选米色和浅棕。彩色棉绳注意选植物染的，化学染的有味道。', icon: '🎨' },
      { title: '算用量', content: '一面50×70cm的挂毯大约需要100米棉绳（比预想的多很多！）。建议多买20%余量，不够了再补颜色可能不一致。', icon: '🧮' },
    ],
    pitfalls: [
      { mistake: '买错成麻绳', consequence: '麻绳粗糙扎手，不适合做装饰品，颜色也偏黄暗沉。', solution: '认准"Macrame棉绳"或"工艺棉绳"，手感柔软光滑的才对。' },
      { mistake: '用量估计不足', consequence: '编到一半发现绳不够了，再买的颜色可能和之前的不一致。', solution: '宁可多买20%，剩下的可以做小挂件。不同批次颜色会有差异，一次买够很重要。' },
    ],
    alternatives: [
      { type: 'budget', name: '棉布条（旧T恤改造）', description: '把旧T恤剪成条，零成本环保编织材料。', price: '免费', pros: ['零成本', '环保', '独特'], cons: ['粗细不均', '颜色受限于旧衣'] },
      { type: 'premium', name: '美利奴羊毛绳', description: '顶级Macrame材料，手感如云朵般柔软，适合做高端墙饰。', price: '约200-300元/100m', pros: ['极致柔软', '高级质感'], cons: ['价格昂贵', '需要干洗'] },
      { type: 'eco', name: '有机棉绳', description: 'GOTS认证有机棉，无漂白无染色，最环保的选择。', price: '约50-80元/100m', pros: ['环保', '无化学残留'], cons: ['颜色单一', '价格略高'] },
    ],
    faqs: [
      { question: '棉绳和毛线有什么区别？', answer: '棉绳是编织用的工艺绳，多股捻合而成，结实有型。毛线是针织用的，太软没有支撑力，编出来的作品会塌。' },
      { question: '棉绳脏了怎么洗？', answer: '用湿布蘸少量中性洗涤剂轻轻擦拭，不要浸泡！棉绳吸水后会变重变形。晾干后用软毛刷梳理流苏恢复蓬松。' },
    ],
    related_tutorial_slugs: ['macrame-wall-hanging'],
    specs: ['直径: 3mm', '材质: 100%纯棉', '长度: 约100米/卷', '颜色: 本白/米色/浅棕/灰色'],
    created_at: '2026-03-10',
  },
  {
    id: 'mat-3', slug: 'italian-vegetable-leather', name: '意大利植鞣皮 (Buttero)', category: 'leather',
    image_url: null, rating: 4.9, price_level: '¥¥¥¥', difficulty_level: 'intermediate',
    summary: '手工皮具的顶级材料，表面光滑细腻，油脂丰富，随使用时间呈现独特的包浆美感。',
    description: '意大利Conceria Walpier制革厂出品的Buttero植鞣皮是全球手工皮具圈的"神皮"。采用传统植物鞣制工艺，不含有害化学物质。皮面光滑如镜，油脂饱满，用手指划过会留下温润的痕迹——这正是植鞣皮最迷人的"养色"特性。使用越久颜色越深，每一道划痕都成为独一无二的记忆。',
    characteristics: [
      { label: '手感', value: '光滑饱满，有温润的蜡质感，越摸越亮' },
      { label: '厚度', value: '1.0-2.5mm可选，1.5mm最适合钱包' },
      { label: '变色', value: '原色从浅肉色→蜜糖色→深棕色，过程极美' },
      { label: '香气', value: '淡淡的天然植鞣香味，无化学异味' },
    ],
    pros: ['世界公认的顶级植鞣皮', '油脂丰富，养色效果极佳', '皮面光滑细腻，适合精细皮件', '纯植物鞣制，环保无毒'],
    cons: ['价格昂贵（600-900元/张）', '新手操作不当容易浪费', '对制作环境要求高（怕水怕油）', '国内市场假货多，需要辨别'],
    buying_guide: [
      { title: '辨别真伪', content: '正品Buttero皮面有自然蜡光，不是死板的亮。用手指摩擦会发热并散发淡香。背面纤维均匀密实，假的背面粗糙。', icon: '🔍' },
      { title: '选厚度', content: '1.5mm适合钱包和卡包，2.0mm适合大包和皮带。新手从1.5mm开始最合适。', icon: '📏' },
      { title: '选颜色', content: '原色(Natural)最经典，可以体验完整的养色过程。想要省时间可以选已染色的棕/黑/蓝。', icon: '🎨' },
    ],
    pitfalls: [
      { mistake: '买到了"韩版植鞣皮"冒充意大利皮', consequence: '国内很多打着"意大利植鞣皮"旗号的其实是国产或韩国的低档皮，油脂不足、变色效果差、容易开裂。', solution: '认准供应商：皮匠世家、匠心皮坊等口碑老店。要求看皮料背面是否有Buttero特有的纤维纹理。' },
      { mistake: '第一件作品就用Buttero', consequence: '因为操作不熟练导致皮料浪费，一张几百块的皮可能只能做出不值钱的作品。', solution: '先用国产植鞣皮（约200元/张）做2-3件作品练手，技法熟练后再升级Buttero。' },
    ],
    alternatives: [
      { type: 'budget', name: '国产植鞣皮', description: '国内优质植鞣皮，油脂和变色效果不如进口，但价格低很多。', price: '约150-300元/张', pros: ['价格实惠', '购买方便', '练手首选'], cons: ['油脂不足', '变色效果一般'] },
      { type: 'beginner', name: '疯马皮', description: '经过油蜡处理的牛皮，表面有复古做旧效果，不显瑕疵，对新手非常友好。', price: '约100-200元/张', pros: ['不显瑕疵', '风格粗犷', '价格友好'], cons: ['不适合精细作品', '质感不够高级'] },
      { type: 'premium', name: '日本枥木植鞣皮', description: '日本顶级植鞣皮，变色效果与Buttero齐名，但风格更温润内敛。', price: '约800-1200元/张', pros: ['日式匠人级品质', '变色温润'], cons: ['价格最高', '购买渠道少'] },
      { type: 'eco', name: '植鞣再生皮', description: '用皮革边角料打碎再压制成型，环保利用不浪费。', price: '约50-80元/张', pros: ['环保', '价格低', '纹理独特'], cons: ['强度不如整皮', '不能做精细雕刻'] },
    ],
    faqs: [
      { question: '植鞣皮和铬鞣皮有什么区别？', answer: '植鞣皮用植物单宁鞣制，环保天然，可以养色变色，适合手工制作。铬鞣皮用化学铬鞣制，颜色丰富但不会变色，手感更软，适合工厂批量生产。手工皮具圈公认植鞣皮更高级。' },
      { question: '植鞣皮沾水怎么办？', answer: '立即用干布吸干，不要揉搓！自然晾干后会留下水渍印，这就是养色的一部分。如果介意可以整张皮均匀打湿后晾干，让颜色均匀。' },
    ],
    related_tutorial_slugs: ['handmade-leather-wallet', 'mini-leather-cardholder', 'leather-carving-wallet'],
    specs: ['厚度: 1.0-2.5mm', '整张: 约2-2.5m²', '鞣制: 植物单宁', '产地: 意大利托斯卡纳'],
    created_at: '2026-03-08',
  },
  {
    id: 'mat-4', slug: 'cherry-wood-carving', name: '樱桃木雕刻料', category: 'woodwork',
    image_url: null, rating: 4.7, price_level: '¥¥¥', difficulty_level: 'beginner',
    summary: '纹理最美观的入门木料，硬度适中，是做木勺和小件木雕的理想选择。',
    description: '北美樱桃木是木工圈公认颜值最高的入门木料。纹理细腻直顺，颜色从浅粉色到深红褐色渐变，随着氧化颜色越来越美。硬度适中（Janka硬度950），比黑胡桃木软、比松木硬，是新手雕刻的理想选择。每一块樱桃木的纹理都是独一无二的，做出来的作品自带高级感。',
    characteristics: [
      { label: '硬度', value: '适中（Janka 950），比黑胡桃软，比松木硬' },
      { label: '纹理', value: '细腻直顺，偶有波浪纹，每块独一无二' },
      { label: '颜色', value: '浅粉→深红褐，随时间氧化越来越美' },
      { label: '气味', value: '淡淡的甜木香，雕刻时很享受' },
    ],
    pros: ['纹理极美，成品颜值高', '硬度适中，新手也能驾驭', '颜色随时间变美，有养木的乐趣', '打磨后手感如丝绸般光滑'],
    cons: ['价格较高（150-250元/块）', '比椴木硬，需要更锋利的刀具', '颜色变化需要适应（粉色→红褐色）', '大块料难买到，适合小件作品'],
    buying_guide: [
      { title: '看裂纹', content: '拿起木料对着光看，确认没有裂纹和节疤。端面有细微裂纹是正常的，但侧面不能有。', icon: '🔍' },
      { title: '选尺寸', content: '木勺推荐15×8×3cm。小摆件推荐10×5×3cm。太大块新手不好掌控，从小块开始。', icon: '📏' },
      { title: '判断干湿度', content: '手指摸木料表面，感觉干爽不潮。含水率应在8-12%，过高后期会开裂。', icon: '💧' },
    ],
    pitfalls: [
      { mistake: '买了没干透的木料', consequence: '雕刻时没问题，过一两个月作品开裂，心血白费。', solution: '买回来后放在室内通风处晾2周再用，让木料适应你的环境湿度。' },
      { mistake: '用美工刀代替雕刻刀', consequence: '美工刀片太薄且不能弯曲，挖不出勺子的凹面，还容易崩刀片伤手。', solution: '至少买一把弯头雕刻刀（约50-100元），专门用来挖凹面。直刃雕刻刀用来修外形。' },
    ],
    alternatives: [
      { type: 'budget', name: '椴木', description: '最软的硬木之一，极易雕刻，零基础入门首选。纹理不明显，适合纯练习。', price: '约30-50元/块', pros: ['极软易刻', '价格最低', '适合大量练习'], cons: ['纹理不明显', '颜色单调', '成品不够高级'] },
      { type: 'premium', name: '黑胡桃木', description: '颜色深沉高级，纹理优雅，适合做展示级作品。', price: '约200-350元/块', pros: ['颜色最高级', '纹理优雅', '硬度适中'], cons: ['价格高', '颜色深细节不易看清'] },
      { type: 'eco', name: '回收旧家具木料', description: '旧家具拆下来的实木，可能是樱桃木/橡木/松木。', price: '几乎免费', pros: ['零成本', '环保', '有故事感'], cons: ['来源不稳定', '可能有钉子', '需要自己辨认木种'] },
    ],
    faqs: [
      { question: '木勺刻好了能真的用来吃饭吗？', answer: '可以！只要涂的是食品级矿物油或核桃油（不是化学漆），就是食品安全的。建议手洗不要放洗碗机。' },
      { question: '樱桃木和黑胡桃木怎么选？', answer: '新手选樱桃木，更软更容易雕刻，颜色也温暖好看。黑胡桃木更硬更贵，但做出来的作品有种高级暗色调，适合展示级作品。' },
    ],
    related_tutorial_slugs: ['wooden-spoon-carving'],
    specs: ['尺寸: 15×8×3cm(标准)', '硬度: Janka 950', '产地: 北美', '含水率: 8-12%'],
    created_at: '2026-03-05',
  },
  {
    id: 'mat-5', slug: 'stone-clay-ladoll', name: '石塑黏土 LaDoll', category: 'clay',
    image_url: null, rating: 4.8, price_level: '¥¥¥', difficulty_level: 'intermediate',
    summary: '手办原型师的首选黏土。湿态柔软细腻，干燥后坚硬如石，可打磨雕刻上色。',
    description: '日本LaDoll石塑黏土是专业手办原型师的行业标准。它的纤维极其细腻，干燥后质地坚硬（像石膏一样），可以打磨、雕刻、钻孔、上色。最大的特点是干燥后不会开裂（普通黏土容易裂），做好的作品可以永久保存。是制作手办、花器、雕塑的首选材料。',
    characteristics: [
      { label: '湿态手感', value: '像奶油一样柔软细腻，极易塑形' },
      { label: '干后硬度', value: '坚硬如石，可打磨雕刻钻孔' },
      { label: '干燥时间', value: '24-48小时自然干燥（取决于厚度）' },
      { label: '收缩率', value: '约5-8%，设计时需要考虑' },
    ],
    pros: ['干燥后极硬，作品永久保存', '纤维细腻，可以做出极精细的细节', '可以打磨，做错了可以修', '不开裂，成功率远高于普通黏土'],
    cons: ['价格较高（60-80元/500g）', '干燥需要较长时间', '国内市场假货多', '干燥后会收缩，新手容易忽略'],
    buying_guide: [
      { title: '辨别真伪', content: '正品LaDoll包装上有镭射防伪标。捏开时纤维均匀细腻无颗粒感。假的纤维粗糙有杂质。', icon: '🔍' },
      { title: '密封保存', content: '石塑黏土开封后接触空气会慢慢硬化。每次用完后用保鲜膜包好再放回密封袋，挤出空气。', icon: '📦' },
    ],
    pitfalls: [
      { mistake: '为了省钱买国产"石塑黏土"', consequence: '国产的纤维粗、杂质多，干燥后不够硬还容易开裂，做出的作品质感差。', solution: '如果预算有限，先用NewFando（约40-60元/500g），比LaDoll便宜但品质接近。纯练习可以用国产的。' },
      { mistake: '黏土太厚没干透就上色', consequence: '外面看起来干了但内部还湿，上色后会发霉、开裂、掉色。', solution: '干燥时间=厚度mm×2小时。5mm厚的作品至少等10小时。用手指弹一下，声音清脆就是干透了。' },
    ],
    alternatives: [
      { type: 'budget', name: '国产石塑黏土', description: '价格实惠，适合大量练习和粗胚制作。', price: '约15-25元/500g', pros: ['价格低', '容易买到'], cons: ['纤维较粗', '干燥后不够硬', '可能开裂'] },
      { type: 'beginner', name: 'NewFando (日本)', description: '比LaDoll更软更好塑形，价格也更友好，新手入门首选。', price: '约40-60元/500g', pros: ['更软易塑形', '价格适中', '品质稳定'], cons: ['干燥后比LaDoll略脆'] },
      { type: 'premium', name: 'LaDoll Premier', description: 'LaDoll的高端线，纤维更细，适合顶级手办制作。', price: '约120-150元/500g', pros: ['极致细腻', '零收缩'], cons: ['价格高', '需要代购'] },
      { type: 'eco', name: '纸黏土', description: '用再生纸浆制作，完全无毒可降解，适合儿童手工。', price: '约5-10元/500g', pros: ['极低价格', '完全无毒', '可降解'], cons: ['强度很低', '不能碰水', '只能做简单造型'] },
    ],
    faqs: [
      { question: '石塑黏土和软陶有什么区别？', answer: '石塑黏土自然风干，不需要烤。软陶必须烤箱烘烤才能定型。石塑黏土干后可以打磨雕刻，软陶烤后不能打磨。做手办/花器用石塑黏土，做饰品/小摆件用软陶。' },
      { question: '黏土干了怎么办？', answer: '如果只是表面干了，加几滴水揉匀就能恢复。如果整块硬化了，基本无法恢复，建议用来做填充材料。所以保存时一定要密封！' },
    ],
    related_tutorial_slugs: ['clay-figure-tutorial'],
    specs: ['重量: 500g/包', '干燥方式: 自然风干', '干燥时间: 24-48小时', '产地: 日本'],
    created_at: '2026-03-01',
  },
  {
    id: 'mat-6', slug: 'dmc-embroidery-thread', name: 'DMC法国刺绣线', category: 'embroidery',
    image_url: null, rating: 4.9, price_level: '¥¥', difficulty_level: 'beginner',
    summary: '全球刺绣爱好者首选品牌。500+色号，色泽鲜艳不褪色，线质柔软光滑。',
    description: '法国DMC刺绣线是刺绣界的"爱马仕"。创立于1746年，270多年的历史积淀。500多个色号覆盖你能想到的所有颜色，每一种颜色都有全球统一的编号，不管在哪买到的DMC 310号黑色都是一模一样的。线质采用埃及长绒棉，6股可拆分，适应不同粗细的需求。色牢固极佳，洗100次也不褪色。',
    characteristics: [
      { label: '色号', value: '500+色，全球统一编号，补色无忧' },
      { label: '线质', value: '埃及长绒棉，6股可拆分，柔软光滑' },
      { label: '色牢度', value: '极佳，洗100次不褪色' },
      { label: '光泽', value: '自然柔和，不刺眼的丝光感' },
    ],
    pros: ['颜色最多最全，几乎没有找不到的颜色', '全球统一色号，随时补货无色差', '色牢固极好，作品可以传代', '6股可拆分，一根线满足各种粗细需求'],
    cons: ['价格最贵（6-8元/束，国产3元）', '单束只有8米，用量大的作品成本高', '线下店少，主要靠网购', '有假货，需要学会辨别'],
    buying_guide: [
      { title: '辨别真伪', content: '正品DMC标签印刷精美，色号清晰，背面有法文说明。线体光滑有丝光感。假的标签模糊，线体粗糙。', icon: '🔍' },
      { title: '颜色搭配', content: '新手建议先买一套基础色（约20色），再按需补充。DMC有色卡，可以买色卡对照选色。', icon: '🎨' },
      { title: '储存方法', content: '缠绕在线轴上按色号排列，放在避光盒子里。阳光直晒会褪色！', icon: '📦' },
    ],
    pitfalls: [
      { mistake: '在拼多多买超便宜的"法国DMC"', consequence: '99%是假货。线体粗糙、色号不对、洗一次就褪色。不仅浪费钱还毁了辛苦绣的作品。', solution: '在DMC天猫旗舰店或口碑好的专业刺绣材料店购买。6元/束以下的基本是假的。' },
      { mistake: '所有颜色各买一束', consequence: '500多种颜色买下来要3000多块钱，而且很多颜色可能永远用不到。', solution: '先确定要绣的图案，按图索色。或者先买一套20-30色的基础色，后面需要什么补什么。' },
    ],
    alternatives: [
      { type: 'budget', name: '国产优质棉绣线', description: '国内品牌如"绣之语"，价格实惠色号也比较全。', price: '约2-3元/束', pros: ['价格低', '色号较全', '练习首选'], cons: ['色牢固略逊', '光泽不如DMC'] },
      { type: 'premium', name: '真丝绣线 (苏州产)', description: '100%桑蚕丝，光泽温润如珍珠，适合高级刺绣。', price: '约15-25元/绞', pros: ['光泽极致', '手感丝滑', '传统工艺'], cons: ['价格高', '需要劈线使用', '怕水怕光'] },
      { type: 'eco', name: '植物染色棉线', description: '天然植物染料染色，无化学残留，颜色有自然的朴素美。', price: '约8-12元/束', pros: ['环保', '无化学物', '颜色自然'], cons: ['色号少', '颜色不鲜艳', '价格不便宜'] },
    ],
    faqs: [
      { question: 'DMC线和国产线差距到底有多大？', answer: '肉眼可见的差距：DMC线光泽更自然（不是亮得刺眼），线体更圆润饱满，绣出来的作品更精致。但如果是练习作品，国产线完全够用。送礼/参赛/传家级作品还是选DMC。' },
      { question: '6股线怎么拆分？', answer: '剪一段约40cm的线，用手指捏住一端，另一只手轻轻抽出其中一股即可。不要硬拉，顺着捻度轻轻抽。' },
    ],
    related_tutorial_slugs: ['french-embroidery-brooch', 'suzhou-embroidery-fan'],
    specs: ['材质: 埃及长绒棉', '股数: 6股可拆分', '长度: 8米/束', '色号: 500+', '产地: 法国'],
    created_at: '2026-03-01',
  },
  {
    id: 'mat-7', slug: 'paper-rattan-alternative', name: '环保纸藤', category: 'weaving',
    image_url: null, rating: 4.2, price_level: '¥', difficulty_level: 'beginner',
    summary: '天然藤条的平价入门替代品。再生纸制成，颜色丰富，适合编织练习和儿童手工。',
    description: '纸藤是用再生纸浆制成的编织材料，是天然藤条的平价替代品。颜色选择多（20+色），不需要浸泡直接就能编织，非常适合零基础新手用来练习编织技法。虽然强度不如天然藤条，但对于不需要承重的装饰品（如小花篮、杯垫、装饰盒）来说完全够用。',
    characteristics: [
      { label: '手感', value: '纸质纤维感，比天然藤条更软' },
      { label: '颜色', value: '20+色可选，色彩比天然藤条丰富得多' },
      { label: '使用便捷', value: '不需要浸泡，开卷即用' },
      { label: '强度', value: '中等，不适合承重作品' },
    ],
    pros: ['价格极低，一卷几块钱适合大量练习', '颜色丰富，可以做彩色编织作品', '不需要预处理，开卷即用', '比天然藤条更软，不伤手'],
    cons: ['强度不如天然藤条', '怕水怕潮，受潮会变形', '质感不如天然藤条高级', '不适合做大型承重作品'],
    buying_guide: [
      { title: '选宽度', content: '3mm最通用。5mm适合做大件装饰。2mm适合精细小件。', icon: '📏' },
      { title: '注意防潮', content: '纸藤最大的缺点就是怕水怕潮。存放在干燥处，完成的作品也要避免接触水。', icon: '💧' },
    ],
    pitfalls: [
      { mistake: '用纸藤做承重篮子', consequence: '纸藤强度不够，放重物会变形甚至断裂。', solution: '纸藤只适合做装饰品、小摆件。需要承重的篮子还是用天然藤条或塑料藤。' },
    ],
    alternatives: [
      { type: 'premium', name: '天然印尼藤条', description: '如果想要做品质作品，升级到天然藤条。', price: '约80-120元/kg', pros: ['品质最高', '耐久性强'], cons: ['价格高', '需要浸泡'] },
      { type: 'eco', name: '旧报纸编织条', description: '把旧报纸卷成条，涂一层清漆防水，最环保的选择。', price: '几乎免费', pros: ['零成本', '超级环保'], cons: ['制作耗时', '强度最低'] },
    ],
    faqs: [
      { question: '纸藤和天然藤条怎么选？', answer: '简单说：练习用纸藤，作品用天然藤。纸藤帮你低成本快速学会技法，天然藤让你的作品有品质感。' },
    ],
    related_tutorial_slugs: ['beginner-weaving-basket'],
    specs: ['宽度: 3mm/5mm', '长度: 约50米/卷', '材质: 再生纸浆', '颜色: 20+色'],
    created_at: '2026-02-28',
  },
  {
    id: 'mat-8', slug: 'basswood-carving', name: '椴木雕刻料', category: 'woodwork',
    image_url: null, rating: 4.4, price_level: '¥', difficulty_level: 'beginner',
    summary: '最软的硬木之一，极易雕刻，是零基础木雕入门的首选木料。',
    description: '椴木是木雕初学者最好的朋友。它是"硬木"中最软的品种之一，硬度只有樱桃木的一半，用普通雕刻刀就能轻松切削。虽然纹理不明显、颜色偏白单调，但对于练习基本技法来说，它是最经济实惠的选择。当你用椴木练熟了手，再升级到樱桃木或黑胡桃木就会轻松很多。',
    characteristics: [
      { label: '硬度', value: '极软（Janka 410），比樱桃木软一倍多' },
      { label: '纹理', value: '不明显，颜色均匀偏白' },
      { label: '雕刻体验', value: '非常顺滑，像切黄油一样轻松' },
      { label: '价格', value: '最便宜的雕刻木料' },
    ],
    pros: ['极软极易雕刻，新手友好度满分', '价格最低，大量练习不心疼', '纹理均匀，适合练习基本功', '不容易崩刀'],
    cons: ['纹理不明显，成品不够高级', '颜色偏白单调', '太软容易磕碰', '不适合做食器（木头有味道）'],
    buying_guide: [
      { title: '选干净的木料', content: '椴木容易有黑结和矿物线，选表面干净的颜色均匀的。', icon: '🔍' },
    ],
    pitfalls: [
      { mistake: '一直只用椴木不升级', consequence: '椴木太软，习惯了以后换樱桃木会觉得非常难刻。', solution: '做完2-3个椴木作品后，就应该尝试一次樱桃木，感受不同木料的特性。' },
    ],
    alternatives: [
      { type: 'premium', name: '樱桃木', description: '纹理最美观的入门木料，硬度适中。', price: '约150-250元/块', pros: ['纹理美', '颜色温暖'], cons: ['价格高', '比椴木硬'] },
    ],
    faqs: [
      { question: '椴木和松木有什么区别？', answer: '椴木是硬木（虽然很软），纹理细腻均匀，适合雕刻细节。松木是软木，纹理粗有树脂，不适合精细雕刻。' },
    ],
    related_tutorial_slugs: ['wooden-spoon-carving'],
    specs: ['尺寸: 15×8×3cm', '硬度: Janka 410', '产地: 国产/北美'],
    created_at: '2026-02-25',
  },
  {
    id: 'mat-9', slug: 'linen-fabric-embroidery', name: '亚麻刺绣底布', category: 'embroidery',
    image_url: null, rating: 4.5, price_level: '¥¥', difficulty_level: 'beginner',
    summary: '刺绣的基础材料。亚麻布纹理自然，是法式刺绣和苏绣的首选底布。',
    description: '选对底布是刺绣成功的一半。亚麻布是最经典的刺绣底布，天然的麻结纹理让绣品有质朴的高级感。棉麻混纺比纯亚麻更柔软，适合新手。纯棉布最便宜但缺少质感。好的底布应该经纬线均匀、没有化学浆料味。',
    characteristics: [
      { label: '最佳选择', value: '亚麻布 — 纹理自然，挺括有型' },
      { label: '新手推荐', value: '棉麻混纺 — 比纯亚麻软，更好绣' },
      { label: '预算选择', value: '纯棉布 — 最便宜但质感一般' },
    ],
    pros: ['亚麻纹理自然高级', '挺括不皱，适合装裱', '透气不闷针'],
    cons: ['纯亚麻较硬，需要适应', '价格中等（棉麻的2倍）', '颜色以米白/浅棕为主'],
    buying_guide: [
      { title: '看经纬', content: '好的刺绣底布经纬线均匀平直，没有歪斜。歪的底布绣出来图案也会歪。', icon: '🔍' },
      { title: '预洗缩水', content: '新布买回来先用温水洗一遍晾干再用。棉麻布料第一次洗会缩水3-5%。', icon: '💧' },
    ],
    pitfalls: [
      { mistake: '用做衣服的薄棉布刺绣', consequence: '太薄太软的布撑不住绣线张力，绣完会皱缩变形。', solution: '选专门的刺绣底布，厚度适中（约150-200g/m²），手摸上去有挺括感。' },
    ],
    alternatives: [
      { type: 'budget', name: '纯棉十字绣布', description: '专门为十字绣设计的网格布，有格眼方便数格子。', price: '约15-30元/米', pros: ['便宜', '网格方便', '适合十字绣'], cons: ['质感一般', '不适合法式刺绣'] },
      { type: 'premium', name: '真丝绢', description: '半透明的真丝面料，双面绣的顶级选择。', price: '约100-200元/米', pros: ['极致高级', '半透明效果'], cons: ['价格极高', '非常难绣'] },
    ],
    faqs: [
      { question: '布一定要用绣绷吗？', answer: '是的！绣绷把布绷紧才能绣出平整的针脚。徒手拿着布绣是最常见的错误，绣出来皱巴巴的。' },
    ],
    related_tutorial_slugs: ['french-embroidery-brooch', 'suzhou-embroidery-fan'],
    specs: ['材质: 亚麻/棉麻混纺', '克重: 150-200g/m²', '颜色: 米白/浅棕/原色'],
    created_at: '2026-02-20',
  },
  {
    id: 'mat-10', slug: 'polymer-clay-fimo', name: '软陶泥 Fimo', category: 'clay',
    image_url: null, rating: 4.6, price_level: '¥¥', difficulty_level: 'beginner',
    summary: '德国Fimo软陶，颜色丰富，适合做饰品和小摆件。烘烤定型后色彩鲜艳不褪色。',
    description: '德国Staedtler出品的Fimo软陶是全球最知名的软陶品牌。与需要风干的石塑黏土不同，软陶需要烤箱烘烤（110°C/30分钟）才能定型。Fimo有50+种预调好色的泥料，颜色鲜艳饱和，适合做饰品、迷你食品、卡通人物等小型作品。',
    characteristics: [
      { label: '塑形手感', value: '偏硬，需要揉软后才好塑形' },
      { label: '颜色', value: '50+色，预调好，颜色鲜艳饱和' },
      { label: '定型方式', value: '烤箱110°C烘烤30分钟' },
      { label: '适用场景', value: '饰品、迷你食品、冰箱贴、小挂件' },
    ],
    pros: ['颜色丰富，不需要自己调色', '烘烤后非常坚硬耐用', '色彩鲜艳不褪色', '适合做精细小件'],
    cons: ['烘烤温度和时间必须严格控制', '需要专用烤箱（不能和食物混用）', '未烤前容易沾灰沾毛', '偏硬，揉软需要花力气'],
    buying_guide: [
      { title: '选系列', content: 'Fimo Soft最适合新手，比Classic更软更好塑形。Fimo Effect含特殊效果（夜光/金属/半透明）。', icon: '📦' },
      { title: '烘烤注意事项', content: '烘烤温度绝对不能超过130°C！超过会烧焦冒烟，释放有毒气体。建议买一个烤箱温度计校准温度。', icon: '⚠️' },
    ],
    pitfalls: [
      { mistake: '用家里的食物烤箱烤软陶', consequence: '软陶烘烤会释放微量气体，附着在烤箱内壁，下次烤食物会污染。而且食物烤箱温度通常不准。', solution: '花几十块钱买一个专用的迷你烤箱，或者用热风枪来烤（更安全）。不要和食物共用烤箱！' },
    ],
    alternatives: [
      { type: 'budget', name: '国产软陶泥', description: '价格最低，适合大量练习和儿童手工。', price: '约5-10元/50g', pros: ['价格低', '颜色多'], cons: ['品质不稳定', '可能含杂质'] },
      { type: 'eco', name: '树脂黏土', description: '自然风干不需要烤，干燥后半透明，适合做花卉和食物模型。', price: '约20-30元/100g', pros: ['不需要烤', '透明效果好'], cons: ['干燥后会收缩', '不适合精细件'] },
    ],
    faqs: [
      { question: '软陶和石塑黏土有什么区别？', answer: '软陶需要烤，石塑黏土自然风干。软陶颜色更鲜艳适合做饰品，石塑黏土干后更硬适合做雕塑。软陶烤了不能打磨，石塑黏土干了可以打磨雕刻。' },
    ],
    related_tutorial_slugs: ['polymer-clay-succulent', 'mini-food-clay'],
    specs: ['重量: 57g/块', '颜色: 50+色', '烘烤: 110°C/30分钟', '产地: 德国'],
    created_at: '2026-02-18',
  },
  {
    id: 'mat-11', slug: 'leather-craft-tools', name: '皮具新手工具套装', category: 'leather',
    image_url: null, rating: 4.3, price_level: '¥¥', difficulty_level: 'beginner',
    summary: '入坑皮具的第一笔投入。选对工具套装，少花冤枉钱，直接做出好作品。',
    description: '皮具工具是新手的第一个"坑"。网上有几十到几千块不等的套装，很多人要么买太便宜的工具没法用，要么买太贵的套装很多东西用不上。其实新手只需要6件核心工具就能做出第一个皮件：菱斩、手缝针、麻蜡线、削薄刀、打磨棒、封边液。其他的可以后续按需添置。',
    characteristics: [
      { label: '核心工具', value: '6件：菱斩+针+线+削薄刀+打磨棒+封边液' },
      { label: '新手预算', value: '200-400元可以配齐一套入门工具' },
      { label: '最重要的', value: '菱斩！便宜斩打孔歪，直接影响成品质量' },
    ],
    pros: ['入门门槛比想象的低的低', '200-400元就能配齐基本工具', '好的工具可以用很多年'],
    cons: ['市场上套装质量参差不齐', '新手不知道什么该买什么不该买', '好工具不便宜'],
    buying_guide: [
      { title: '核心6件', content: '菱斩(法式斜平斩3.38mm)+手缝针×2+麻蜡线(0.45mm)+削薄刀+打磨棒+封边液=入门套装。这6件就能做卡包和钱包了。', icon: '🔧' },
      { title: '菱斩最重要', content: '新手买300元以上的法式斜平斩，打出来的孔才整齐。50块钱的普通菱斩孔歪线也歪，做出来的东西没法看。', icon: '⭐' },
      { title: '哪些不用急着买', content: '削薄机(贵，手工削薄刀够用)、烫边机(贵，打磨棒够用)、皮雕工具(等你基础皮件做熟了再考虑)。', icon: '❌' },
    ],
    pitfalls: [
      { mistake: '买199元"皮具工具36件套装"', consequence: '大部分工具用不上，核心工具（菱斩）质量太差，打孔歪斜，做出来的第一个作品就打击信心。', solution: '不买套装！按核心6件清单一件件买，每件都选中档品质。总共花400元左右配齐。' },
    ],
    alternatives: [
      { type: 'budget', name: '分件购买国产中档工具', description: '按核心6件清单，每件选国产中档品牌，200元左右配齐。', price: '约200元/套', pros: ['精准只买需要的', '性价比高'], cons: ['需要自己做功课'] },
    ],
    faqs: [
      { question: '新手第一件皮具工具要花多少钱？', answer: '建议预算300-400元，其中菱斩占大头（150-200元），其他5件加起来200元左右。这个预算可以做出品质不错的皮件了。' },
    ],
    related_tutorial_slugs: ['mini-leather-cardholder', 'handmade-leather-wallet'],
    specs: ['推荐菱斩: 法式斜平斩3.38mm', '推荐线: 麻蜡线0.45mm', '推荐皮料: 植鞣皮1.5mm'],
    created_at: '2026-02-15',
  },
  {
    id: 'mat-12', slug: 'uv-resin-jewelry', name: 'UV树脂', category: 'other',
    image_url: null, rating: 4.4, price_level: '¥¥', difficulty_level: 'beginner',
    summary: '最快捷的手作材料之一。UV灯照射3-5分钟即可固化，适合做饰品、小摆件、封入干花等。',
    description: 'UV树脂（紫外线固化树脂）是最适合快节奏手作爱好者的材料。不需要等几个小时干燥，不需要高温烘烤，只需要UV灯照射3-5分钟就能完成固化。可以封入干花、亮片、颜料做出各种效果。特别适合做耳环、项链、发卡等饰品。操作简单，成果立等可取，成就感满满。',
    characteristics: [
      { label: '固化方式', value: 'UV/LED灯照射3-5分钟快速固化' },
      { label: '透明度', value: '极高，像水晶一样透明' },
      { label: '适用场景', value: '饰品、封入装饰、小摆件' },
      { label: '气味', value: '有轻微树脂味，需要在通风处使用' },
    ],
    pros: ['固化极快，3-5分钟完成', '透明度极高，做出水晶效果', '操作简单，适合零基础', '可以封入各种装饰物'],
    cons: ['有气味，需要通风', 'UV灯是额外投入', '大件作品成本高', '未固化的树脂有轻微毒性'],
    buying_guide: [
      { title: '选树脂类型', content: '硬胶适合做饰品和摆件。软胶适合做模具翻模。新手从硬胶开始。', icon: '📦' },
      { title: '安全第一', content: '操作时戴手套！未固化的树脂不要接触皮肤。在通风处操作，最好戴口罩。', icon: '⚠️' },
      { title: 'UV灯选择', content: '36W以上的LED UV灯固化最快。小功率的（9W）固化慢且可能固化不完全。', icon: '💡' },
    ],
    pitfalls: [
      { mistake: '在密闭房间里做UV树脂', consequence: '树脂挥发的气味在密闭空间会让人头晕恶心，长期可能影响健康。', solution: '必须在通风处操作（开窗+风扇），戴上口罩和手套。孕妇和儿童不要接触未固化的树脂。' },
      { mistake: '贪快一次倒太厚', consequence: 'UV树脂一次固化深度有限（约3-5mm），倒太厚底部固化不了还是液体。', solution: '分层倒入，每层不超过5mm，照一次灯→再倒一层→再照灯，逐层完成。' },
    ],
    alternatives: [
      { type: 'budget', name: '环氧AB树脂', description: '不需要UV灯，自然固化（12-24小时），价格更低。', price: '约30-50元/套', pros: ['价格更低', '不需要UV灯', '适合大件'], cons: ['固化慢', '操作更复杂'] },
      { type: 'eco', name: '植物基树脂', description: '用大豆油提取的环保树脂，无毒无味。', price: '约80-120元/套', pros: ['无毒无味', '环保'], cons: ['固化时间更长', '价格较高'] },
    ],
    faqs: [
      { question: 'UV树脂有毒吗？', answer: '未固化的UV树脂有轻微毒性和刺激性，接触皮肤可能引起过敏。但完全固化后是无毒安全的，可以正常佩戴。操作时做好防护（手套+口罩+通风），固化后就没问题了。' },
    ],
    related_tutorial_slugs: [],
    specs: ['固化: UV/LED灯3-5分钟', '透明度: 极高', '硬度: 硬胶/软胶可选', '规格: 100g/200g/500g'],
    created_at: '2026-02-10',
  },
]

// 辅助函数
export function getMaterialBySlug(slug: string): MaterialData | undefined {
  return allMaterials.find((m) => m.slug === slug)
}

export function getMaterialsByCategory(category: string): MaterialData[] {
  return allMaterials.filter((m) => m.category === category)
}

export function searchMaterials(query: string): MaterialData[] {
  const q = query.toLowerCase()
  return allMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.includes(q)
  )
}

export const materialCategories = [
  { slug: 'weaving', name: '编织材料', icon: '🧶', count: 3, description: '藤条、棉绳、竹篾、Macrame线材等编织所需材料' },
  { slug: 'leather', name: '皮具材料', icon: '👜', count: 2, description: '植鞣皮、铬鞣皮、五金件、缝线等皮具制作材料' },
  { slug: 'woodwork', name: '木工材料', icon: '🪵', count: 2, description: '雕刻木料、砂纸、木蜡油、木工胶等木工材料' },
  { slug: 'clay', name: '黏土材料', icon: '🏺', count: 2, description: '石塑黏土、软陶泥、树脂黏土、塑形工具等' },
  { slug: 'embroidery', name: '刺绣材料', icon: '🪡', count: 2, description: '绣线、绣布、绣绷、刺绣针等刺绣材料' },
  { slug: 'other', name: '其他材料', icon: '✨', count: 1, description: 'UV树脂、蜡烛材料、皂基、纸艺材料等' },
]
