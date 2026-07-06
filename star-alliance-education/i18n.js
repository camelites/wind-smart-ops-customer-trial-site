(function () {
  const translations = {
    "新加坡星系国际教育": "Star Alliance Education Singapore",
    "Star Alliance Education": "Star Alliance Education",
    "Star Alliance Education & Services": "Star Alliance Education & Services",
    "核心项目": "Core Programs",
    "全程服务": "Full-Cycle Service",
    "特色案例": "Featured Cases",
    "合作伙伴": "Partners",
    "官方资质": "Official Credentials",
    "联系我们": "Contact Us",
    "预约咨询": "Book a Consultation",
    "主要导航": "Main navigation",
    "主导航": "Main navigation",
    "新加坡星系国际教育首页": "Star Alliance Education Singapore homepage",

    "新加坡政府教育资源与国际升学规划服务": "Singapore Government Education Resources and Global Pathway Planning",
    "致力于为学生量身定制新加坡优质教育资源，面向中国家庭提供新加坡政府教育体系、 精英人才引进计划、中考与高考、海外名校申请、背景提升及境外陪伴服务。": "We tailor high-quality Singapore education resources for students and support Chinese families with Singapore government-school pathways, elite talent programs, O-Level and A-Level routes, overseas university applications, profile building, and in-country support.",
    "了解核心项目": "Explore Programs",
    "查看授权资质": "View Credentials",
    "公司核心数据": "Company highlights",
    "家庭陪伴孩子成长的教育服务示意图": "Family education service image",
    "名亚洲学生新加坡留学服务经验": "Asian students served for Singapore study pathways",
    "每年经星系赴新加坡学生": "Students supported to Singapore each year",
    "18年": "18 yrs",
    "中国大陆相关工作积累": "Years of related experience in mainland China",
    "成都": "Chengdu",
    "华西代表处": "West China Representative Office",
    "北京 · 杭州": "Beijing · Hangzhou",
    "重庆 · 西安 · 济南等服务网络": "Service network including Chongqing, Xi'an and Jinan",

    "连接新加坡教育体系，服务中国家庭的长期升学规划": "Connecting Singapore Education Pathways for Long-Term Family Planning",
    "星系国际教育长期深耕新加坡政府教育资源与国际升学咨询，围绕学生的年龄阶段、 学术基础、语言能力、家庭目标和未来发展方向，先进行评估与路径设计，再衔接申请、 备考、升学指导、背景提升和境外支持，为家庭提供连续、可追踪的服务。": "Star Alliance Education has long focused on Singapore government education resources and international pathway consulting. We evaluate each student's stage, academic foundation, language ability, family goals, and future direction before designing a path that connects applications, preparation, guidance, profile building, and in-country support.",
    "公司动态": "Company News",
    "2026年6月18日": "June 18, 2026",
    "北京代表处正式开设": "Beijing Representative Office Officially Opened",
    "星系国际教育北京代表处正式开设，并持续参与华北地区教育交流、学校发展项目与家庭升学规划服务。": "The Beijing representative office of Star Alliance Education has officially opened, supporting education exchange, school development projects, and family pathway planning in North China.",

    "以新加坡政府教育体系为核心入口，结合国际考试、海外名校规划和家庭长期发展目标，为学生建立清晰路径。": "With Singapore's government education system as a core entry point, we combine international examinations, global university planning, and long-term family goals to build clear pathways for students.",
    "新加坡政府中小学项目": "Singapore Government Primary and Secondary School Program",
    "通过专业测评，制定定制化留学方案，帮助适龄学生理解新加坡政府教育体系、入学节点与就读准备。": "Through professional assessment, we develop tailored study plans and help students understand Singapore's public-school system, entry timing, and preparation requirements.",
    "深耕新加坡公立学校申请服务": "Focused on Singapore public-school applications",
    "新加坡中考项目": "Singapore O-Level Pathway",
    "衔接新加坡中学会考路径，面向新加坡理工学院、初级学院及申请海外名校预科等多元方向。": "Connects students to Singapore O-Level pathways, with options including polytechnics, junior colleges, and foundation routes for overseas universities.",
    "主攻初级学院及海外名校预科": "Focused on junior colleges and global foundation routes",
    "新加坡高考项目": "Singapore A-Level Pathway",
    "新加坡高考路径": "Singapore A-Level Pathway",
    "衔接新加坡高中毕业会考课程、考试与申请规划，拓展进入新加坡政府大学和QS前100顶尖名校机会。": "Supports Singapore A-Level curriculum, examination preparation, and application planning for Singapore public universities and QS Top 100 institutions.",
    "直通政府大学及QS前100名校": "Pathways to public universities and QS Top 100 institutions",
    "海外名校直通车": "Global University Express Pathway",
    "结合专业兴趣、学术背景和预算，规划海外名校分院本科、硕士申请路径。": "Plans undergraduate and graduate pathways at leading global university campuses based on major interests, academic background, and budget.",
    "TOP100目标院校": "Targeting Top 100 universities",
    "项目体系资料节选": "Program system excerpt",

    "从申请前评估、升学指导到境外就读支持，围绕家庭决策与学生成长持续推进。": "From pre-application assessment and pathway guidance to in-country support, we provide continuous services around family decisions and student growth.",
    "规划与课程辅导现场": "Planning and course guidance session",
    "境外接机与入学协助": "Airport pickup and enrollment support",
    "申请": "Application",
    "入学与材料申请": "Enrollment and Document Applications",
    "梳理申请条件、时间节点、材料清单和考试准备，减少家庭信息差。": "Clarifies requirements, timelines, document lists, and exam preparation to reduce information gaps.",
    "规划": "Planning",
    "阶段化升学规划": "Stage-Based Pathway Planning",
    "结合学生基础、语言能力和家庭目标，制定适合当前阶段的路线图。": "Builds a suitable roadmap based on academic foundation, language ability, and family goals.",
    "提升": "Profile",
    "背景提升与活动规划": "Profile Building and Activity Planning",
    "围绕学术能力、表达能力、国际活动、竞赛证书和实习机会，补足长期竞争力。": "Strengthens long-term competitiveness through academics, communication, international activities, competitions, certificates, and internships.",
    "境外": "In-Country",
    "境外服务与后续陪伴": "In-Country Services and Ongoing Support",
    "提供入境接机、学校报到、日常汇报、成绩与出勤反馈、保险协助和后续升学衔接。": "Includes arrival pickup, school registration, regular updates, grades and attendance feedback, insurance support, and onward pathway guidance.",
    "升学": "Progression",
    "升学指导与路径衔接": "Progression Guidance and Pathway Connection",
    "结合学生阶段成果，持续评估中小学、中考、高考及海外名校方向，帮助家庭及时调整申请策略。": "Continuously reviews student progress and adjusts strategies across school, O-Level, A-Level, and overseas university routes.",
    "新加坡就读期间持续服务周期参考": "Reference service cycle during study in Singapore",
    "5-10年": "5-10 yrs",
    "每月": "Monthly",
    "阶段性学习、出勤与活动信息反馈": "Learning, attendance, and activity updates",
    "7个": "7 sites",
    "星系家园管理据点资料": "Star Alliance home-management site records",

    "以下案例均采用匿名化表达，隐去学生姓名、证件、联系方式等个人隐私，仅展示路径与结果类型。": "All cases are anonymized. Names, IDs, contact details, and other personal information are removed; only pathways and result types are shown.",
    "精英人才计划": "Elite Talent Program",
    "从升学规划到录取成果，呈现新加坡精英教育路径的阶段性突破": "From pathway planning to admissions outcomes, showing milestones in Singapore's elite education route",
    "适合希望提前布局新加坡优质教育资源的家庭参考。": "For families planning early access to high-quality Singapore education resources.",
    "多校录取成果": "Multiple-School Admission Results",
    "多所海外学校录取结果集中展示，体现申请策略与材料准备能力": "A consolidated view of overseas admissions outcomes, reflecting application strategy and document preparation",
    "展示学校选择、申请组合和结果落地的完整服务价值。": "Shows the value of school selection, application portfolio planning, and results delivery.",
    "通过阶段化规划进入更高层级升学通道，连接新加坡及海外名校机会": "Stage-based planning to enter higher-level pathways and connect to opportunities in Singapore and overseas",
    "强调长期陪伴、路径调整和关键节点申请支持。": "Emphasizes long-term support, pathway adjustment, and key application milestones.",
    "海外本科、硕士与博士阶段连续衔接，打造长期国际化升学路径": "Connecting undergraduate, master's, and doctoral stages for a long-term global education pathway",
    "适合重视长期发展、专业选择和名校衔接的家庭。": "For families focused on long-term development, major selection, and elite university progression.",
    "海外名校升学": "Global University Admission",
    "结合学生背景与目标院校，完成个性化申请定位和录取衔接": "Personalized application positioning and admissions support based on student background and target schools",
    "从方案制定到材料呈现，帮助家庭更清晰地判断升学路径。": "Helps families judge pathways more clearly from plan design to document presentation.",
    "查看完整案例": "View Full Case",

    "围绕政府教育合作、成都重点高中、金融机构及私人银行高端客户服务场景，持续开展讲座、沙龙、项目推介与升学规划服务。": "We continue to provide lectures, salons, program briefings, and pathway planning in government education cooperation, key Chengdu high schools, financial institutions, and private banking client settings.",
    "公立学校与教育系统": "Public Schools and Education System",
    "与成都市高新区教育局相关平台、成都重点高中及多地学校开展项目沟通、主题讲座和国际教育交流；曾参与高新区教育处新加坡项目专场推介等活动。": "We have engaged with Chengdu High-Tech Zone education platforms, key Chengdu high schools, and schools in other regions through project communication, lectures, and international education exchange, including Singapore project briefings.",
    "成都市高新区教育局": "Chengdu High-Tech Zone Education Bureau",
    "成都七中": "Chengdu No.7 High School",
    "石室中学": "Shishi High School",
    "成都实验外国语学校": "Chengdu Experimental Foreign Languages School",
    "绵阳外国语": "Mianyang Foreign Languages School",
    "德阳中学": "Deyang High School",
    "西川汇教育集团": "Xichuanhui Education Group",
    "查看教育合作详情": "View Education Partnership Details",
    "金融机构与私人银行": "Financial Institutions and Private Banking",
    "面向银行私人银行、高净值客户服务与家庭教育规划场景，联合开展国际教育主题分享、留学规划沙龙与客户活动支持。": "For private banking, high-net-worth client services, and family education planning, we co-host international education talks, study-planning salons, and client activities.",
    "招商银行私人银行": "China Merchants Bank Private Banking",
    "中信银行私人银行": "CITIC Bank Private Banking",
    "中国银行": "Bank of China",
    "天府银行": "Tianfu Bank",
    "成都银行": "Bank of Chengdu",
    "华侨银行": "OCBC Bank",
    "汇丰银行": "HSBC",
    "私人银行客户活动": "Private banking client events",
    "查看金融机构合作详情": "View Financial Partnership Details",
    "招商银行": "China Merchants Bank",
    "中信银行": "CITIC Bank",
    "国际教育安全之路沙龙": "International Education Safety Path Salon",
    "招商银行相关分行及私人银行活动场景，联合星系国际教育开展国际教育主题分享，围绕子女国际化升学规划与新加坡精英教育路径展开交流。": "In China Merchants Bank branch and private banking events, Star Alliance Education shares international education insights around children's global pathway planning and Singapore elite education routes.",
    "查看活动详情": "View Event Details",
    "中信私人银行成都分行": "CITIC Private Banking Chengdu Branch",
    "新加坡通向全球名校教育规划": "Singapore Pathways to Global Top Universities",
    "面向私人银行高净值家庭举办教育规划沙龙，聚焦新加坡留学规划、政府奖学金申请、IVS1 政策解读与个性化升学方案。": "Education planning salons for private banking families, covering Singapore study planning, government scholarship applications, IVS1 policy interpretation, and personalized pathway plans.",
    "2021-2025 社会活动总览：政府合作、金融机构联办、媒体曝光与国际峰会": "2021-2025 activity overview: government cooperation, financial institution events, media exposure, and international summits",
    "政府合作：走进成都新川服务中心，推进新加坡教育资源引进沟通": "Government cooperation: visiting Chengdu Xinchuan Service Center to discuss Singapore education resources",
    "高新区合作场景：在新川片区开展现场考察与项目交流": "High-Tech Zone cooperation: site visits and project exchange in the Xinchuan area",
    "南山中学：重点学校讲座与新加坡教育主题分享": "Nanshan High School: key-school lecture and Singapore education sharing",
    "棠湖中学：面向学生和家庭开展国际升学规划说明": "Tanghu High School: international pathway planning for students and families",
    "陕西省榆林中学：新加坡顶尖教育资源与名校升学路径分享": "Yulin High School, Shaanxi: Singapore education resources and elite university pathways",
    "成都七中：重点学校国际理解与升学规划活动现场": "Chengdu No.7 High School: international understanding and pathway planning event",
    "德阳外国语学校：重点学校专家讲座现场": "Deyang Foreign Languages School: expert lecture at a key school",
    "教育局合作：与成都市教育局国际交流中心合作签约现场": "Education bureau cooperation: signing with Chengdu Education Bureau International Exchange Center",
    "家长课堂：面向家庭开展国际人才培养与升学规划说明": "Parent classroom: international talent cultivation and pathway planning",
    "校园文化活动：将新加坡多元文化带入学校现场体验": "Campus culture event: bringing Singapore's multicultural experience to schools",

    "星系国际教育重视授权资质、院校合作与长期服务记录，以清晰材料和可追溯合作关系建立家庭信任。": "Star Alliance Education values authorization credentials, school partnerships, and long-term service records, building trust through clear materials and traceable cooperation.",
    "新加坡商务部注册资料": "Singapore business registration records",
    "新加坡旅游局授权": "Singapore Tourism Board authorization",
    "新加坡教育部教师培训中心授权": "Singapore Ministry of Education teacher training center authorization",
    "新加坡南洋理工大学授权": "Nanyang Technological University authorization",
    "新加坡驻成都总领馆商务处推荐函": "Recommendation letter from the Commercial Office of the Singapore Consulate-General in Chengdu",
    "教育集团战略合作": "Strategic cooperation with education groups",
    "授权资质证书节选": "Credential certificate excerpt",
    "官方授权与资质材料": "Official authorization and credential materials",
    "学生案例与成绩材料节选": "Student case and academic record excerpt",
    "院校与机构合作资质": "School and institutional partnership credentials",
    "推荐函资料节选": "Recommendation letter excerpt",

    "欢迎预约升学路径评估。我们将结合学生阶段、学业基础、语言能力和家庭目标，提供初步咨询建议。": "Book a pathway assessment. We will provide initial advice based on the student's stage, academic foundation, language ability, and family goals.",
    "电话：18081179155": "Phone: 18081179155",
    "邮箱：info@staralliance-education.com": "Email: info@staralliance-education.com",
    "成都：中国代表处，成都市武侯区星狮路711号大合仓商馆1栋2单元1001": "Chengdu: China Representative Office, Unit 1001, Unit 2, Building 1, Dahecang Business Hall, No.711 Xingshi Road, Wuhou District, Chengdu",
    "代表处网络：成都 · 北京 · 杭州 · 重庆 · 西安 · 济南等": "Representative network: Chengdu · Beijing · Hangzhou · Chongqing · Xi'an · Jinan and more",
    "微信公众号": "WeChat Official Account",
    "扫码关注星系国际教育动态": "Scan to follow Star Alliance Education updates",
    "视频号": "Video Channel",
    "扫码观看星系国际教育视频内容": "Scan to watch Star Alliance Education videos",
    "新加坡教育资源与国际升学规划服务": "Singapore education resources and global pathway planning services",

    "返回特色案例": "Back to Featured Cases",
    "特色案例详情": "Featured Case Details",
    "隐私说明": "Privacy Note",
    "案例展示已隐去学生姓名、证件号码、联系方式等敏感信息，仅用于说明规划路径、服务内容与录取成果类型。": "Student names, ID numbers, contact details, and other sensitive information have been removed. Cases are shown only to explain planning paths, services, and admission result types.",
    "案例亮点": "Case Highlights",
    "服务价值": "Service Value",
    "预约路径评估": "Book a Pathway Assessment",
    "继续查看其他案例": "Explore More Cases",
    "针对希望提前布局新加坡优质教育资源的家庭，星系国际教育提供从目标评估、路径选择到材料准备的连续支持，帮助学生在关键阶段形成更清晰的升学方向。": "For families planning early access to quality Singapore education resources, we provide continuous support from goal assessment and path selection to document preparation.",
    "精英人才计划相关录取成果资料，页面已进行隐私处理。": "Elite Talent Program admission-result materials with privacy information removed.",
    "路径规划": "Pathway Planning",
    "精英教育": "Elite Education",
    "录取成果": "Admission Results",
    "结合学生当前阶段和家庭目标，梳理新加坡教育体系下的可行路径。": "Clarify viable routes within Singapore's education system based on the student's current stage and family goals.",
    "围绕目标学校与项目要求，提前准备语言、学术、活动和申请材料。": "Prepare language, academics, activities, and documents around target school and program requirements.",
    "通过阶段性复盘，帮助家庭在关键时间点做出更稳妥的升学选择。": "Use staged reviews to help families make sound decisions at key moments.",
    "这一类案例体现的是长期规划的价值：不是只处理单次申请，而是围绕学生成长阶段持续调整策略，让申请材料、时间节点和结果目标相互匹配。": "This type of case reflects the value of long-term planning: not just handling one application, but continuously adjusting strategy so materials, timing, and goals align.",
    "通过合理的学校组合、申请节奏和材料呈现，帮助学生获得多所学校的录取机会，为家庭后续择校和路径决策留出更充足空间。": "Through a balanced school portfolio, application rhythm, and document presentation, students gain multiple admission opportunities and families retain more decision space.",
    "多所海外学校录取成果汇总资料，学生个人信息已隐去。": "Summary of multiple overseas admission results with personal information removed.",
    "多校申请": "Multiple Applications",
    "材料规划": "Document Planning",
    "择校空间": "School Choice",
    "根据学生条件建立冲刺、匹配和稳妥层次的申请组合。": "Build a reach, match, and safe school portfolio based on the student's profile.",
    "统一梳理申请材料、文书表达和时间节点，减少重复沟通成本。": "Organize documents, statements, and timelines to reduce repeated communication.",
    "在多个录取结果之间协助家庭评估学校、课程和后续发展路径。": "Help families evaluate schools, courses, and future routes across admission offers.",
    "多校录取不仅是结果数量，更重要的是让家庭拥有选择权。星系国际教育通过前期定位和过程管理，提高申请结果的确定性和可比较性。": "Multiple offers are not just about quantity; they give families real choice. Early positioning and process management improve certainty and comparability.",
    "面向希望通过新加坡体系进入更高层级大学机会的学生，星系国际教育提供考试路径、课程节奏和申请衔接的综合规划支持。": "For students seeking higher-level university opportunities through Singapore's system, we provide integrated planning for exams, course rhythm, and applications.",
    "学生升学成果照片资料，已按公开展示要求处理。": "Student pathway-result photo processed for public display.",
    "新加坡体系": "Singapore System",
    "阶段提升": "Stage Progression",
    "名校衔接": "Elite University Connection",
    "评估学生学术基础和适应能力，明确适合的考试与升学路线。": "Assess academic foundation and adaptability to identify suitable exam and progression routes.",
    "在课程学习、考试准备和申请节奏之间建立清晰安排。": "Create clear coordination between coursework, exam preparation, and application timing.",
    "结合阶段成果，为后续本科、研究生或海外名校申请创造条件。": "Use staged results to support future undergraduate, graduate, or elite university applications.",
    "这一类型案例强调路径设计和阶段跃迁。通过持续跟进学生表现，及时调整目标和申请策略，可以把单点成绩转化为更完整的升学机会。": "This type of case emphasizes pathway design and staged progression. Ongoing tracking turns individual results into broader opportunities.",
    "对于重视长期发展的家庭，星系国际教育关注的不只是某一次录取，而是学生从本科到研究生乃至博士阶段的专业方向、学校层级和国际竞争力积累。": "For families focused on long-term development, we look beyond one admission outcome to major direction, school level, and international competitiveness from undergraduate to graduate and doctoral stages.",
    "海外名校直通车录取成果资料，相关隐私信息已处理。": "Global university pathway admission-result materials with privacy details processed.",
    "长期规划": "Long-Term Planning",
    "海外名校": "Global Universities",
    "专业衔接": "Major Connection",
    "结合学生长期目标，规划本科、硕士与博士阶段的衔接方向。": "Plan the connection between undergraduate, master's, and doctoral stages around long-term goals.",
    "关注专业选择、课程背景、研究经历和申请材料的一致性。": "Focus on consistency across major choice, course background, research experience, and application materials.",
    "帮助家庭理解不同国家和院校体系下的录取逻辑和发展路径。": "Help families understand admissions logic and development routes across countries and institutions.",
    "长期升学规划的关键在于连续性。星系国际教育通过多年服务经验，帮助学生把每个阶段的选择变成下一阶段申请的基础。": "Continuity is key to long-term planning. Each stage should become a foundation for the next application.",
    "星系国际教育根据学生的学术背景、语言基础、活动经历和家庭期待，制定更贴合个人情况的申请方案，提升目标院校匹配度。": "We design personalized applications based on academic background, language foundation, activities, and family expectations to improve school fit.",
    "海外名校升学成果照片资料，保留公开展示所需信息。": "Global university admission-result photo with only public-display information retained.",
    "个性化申请": "Personalized Application",
    "背景梳理": "Profile Review",
    "录取衔接": "Admission Connection",
    "从学生真实情况出发，避免模板化申请方案。": "Start from the student's real profile and avoid template-based applications.",
    "围绕目标院校要求梳理优势、补足短板，并优化材料呈现。": "Review strengths, address gaps, and optimize materials around target school requirements.",
    "在录取后继续协助家庭处理入学衔接、后续规划等关键事项。": "After admission, continue supporting enrollment connection and follow-up planning.",
    "个性化申请的价值在于让学生优势被准确理解。通过系统梳理和专业呈现，家庭可以更清楚地看到路径、风险和机会。": "The value of personalization is making student strengths understood accurately. Systematic review and professional presentation clarify routes, risks, and opportunities.",

    "返回合作伙伴": "Back to Partners",
    "合作伙伴详情": "Partner Details",
    "展示说明": "Display Note",
    "本页用于对外展示星系国际教育在教育系统、重点学校、金融机构与私人银行场景中的合作活动。活动图片按公开传播需求进行整理呈现。": "This page presents Star Alliance Education's partner activities across education systems, key schools, financial institutions, and private banking settings. Images are curated for public communication.",
    "合作价值": "Partnership Value",
    "活动场景": "Activity Context",
    "咨询合作与项目介绍": "Discuss Partnership and Programs",
    "活动照片展示": "Activity Photo Gallery",
    "继续查看其他合作场景": "Explore Other Partnership Scenarios",
    "走进教育系统与重点学校，持续开展新加坡教育项目交流与升学规划活动": "Entering Education Systems and Key Schools for Singapore Program Exchange and Pathway Planning",
    "星系国际教育围绕成都市高新区教育局相关平台、成都重点高中及多地学校，开展项目推介、专家讲座、国际理解教育与升学规划说明，帮助学校与家庭更清晰地了解新加坡教育路径。": "Around Chengdu High-Tech Zone education platforms, key Chengdu high schools, and schools in other regions, we conduct program briefings, expert lectures, global understanding activities, and pathway planning sessions.",
    "2021-2025 社会活动总览资料，涵盖政府合作、学校讲座、金融机构联办与媒体曝光等场景。": "2021-2025 activity overview covering government cooperation, school lectures, financial institution events, and media exposure.",
    "教育系统合作": "Education System Cooperation",
    "成都重点高中": "Key Chengdu High Schools",
    "项目推介": "Program Briefing",
    "家校活动": "Family-School Activities",
    "面向教育主管部门、学校与家庭，呈现新加坡教育资源和国际升学路径。": "Present Singapore education resources and global pathways to education authorities, schools, and families.",
    "结合学校需求开展主题讲座、国际理解活动和学生发展规划说明。": "Conduct lectures, global understanding activities, and student development planning based on school needs.",
    "通过现场交流、项目介绍和后续咨询，建立更可追溯的合作与服务链路。": "Build traceable cooperation and service links through on-site exchange, program introductions, and follow-up consultation.",
    "这些活动体现星系国际教育的外部合作能力：既能在教育系统和重点学校场景中进行项目沟通，也能面向学生与家长提供清晰、可理解、可落地的升学规划说明。": "These activities demonstrate our external cooperation capability: communicating programs in education-system and key-school settings while providing families with clear, understandable, and actionable pathway planning.",
    "以下为高新区教育合作、成都重点学校及多地学校活动现场，重点展示真实活动场景和长期服务覆盖。": "The following photos show High-Tech Zone education cooperation, key Chengdu schools, and activities at schools in multiple regions, highlighting real scenes and long-term service coverage.",
    "成都新川服务中心现场交流": "On-Site Exchange at Chengdu Xinchuan Service Center",
    "走进成都新川服务中心，围绕新加坡教育资源引进、国际教育项目合作与区域家庭服务需求进行现场沟通。": "Visiting Chengdu Xinchuan Service Center for discussions on Singapore education resources, international education cooperation, and local family service needs.",
    "高新区合作场景考察": "High-Tech Zone Cooperation Site Visit",
    "在新川片区及新加坡创新中心相关场景开展考察交流，推动教育资源、项目服务与区域需求的衔接。": "Site visits and exchange in the Xinchuan area and Singapore Innovation Center-related settings, connecting education resources and services with local needs.",
    "教育局国际交流中心合作签约": "Signing with Education Bureau International Exchange Center",
    "与成都市教育局国际交流中心相关合作场景，体现星系国际教育在教育系统合作中的正式沟通基础。": "Cooperation scene with Chengdu Education Bureau International Exchange Center, reflecting a formal communication foundation.",
    "成都七中重点学校活动": "Chengdu No.7 High School Activity",
    "面向重点学校学生与家庭开展国际理解、升学路径和新加坡教育体系相关主题分享。": "Sharing global understanding, pathway planning, and Singapore education system topics with students and families at a key school.",
    "棠湖中学升学规划说明": "Tanghu High School Pathway Planning Session",
    "围绕新加坡教育路径、学生发展方向和家庭规划需求开展现场说明，帮助家庭建立更清晰的升学认知。": "On-site briefing on Singapore education pathways, student development, and family planning needs.",
    "南山中学主题讲座": "Nanshan High School Thematic Lecture",
    "在重点学校场景中开展新加坡教育主题分享，围绕国际化人才培养和升学路径进行交流。": "Singapore education sharing at a key school around global talent cultivation and pathway planning.",
    "德阳外国语学校专家讲座": "Deyang Foreign Languages School Expert Lecture",
    "面向学校与家庭展开国际教育专家讲座，结合学生阶段特点介绍新加坡及海外升学方向。": "Expert international education lecture for schools and families, introducing Singapore and overseas routes by student stage.",
    "陕西省榆林中学讲座": "Yulin High School, Shaanxi Lecture",
    "围绕新加坡顶尖教育资源、政府奖学金和名校升学路径进行介绍，扩大优质教育资源触达范围。": "Introducing Singapore education resources, government scholarships, and elite university pathways.",
    "家长课堂与项目说明会": "Parent Classroom and Program Briefing",
    "面向家庭开展国际人才培养和新加坡项目说明，回应家长关于路径选择、时间节点和申请准备的核心问题。": "Program briefing for families on global talent cultivation and Singapore pathways, answering key questions about route selection, timing, and preparation.",
    "校园文化体验活动": "Campus Culture Experience",
    "通过新加坡多元文化校园活动，让学生在体验中理解国际教育环境与跨文化学习方式。": "Helping students understand international learning environments and cross-cultural study through Singapore multicultural campus activities.",
    "联合金融机构与私人银行，为高净值家庭提供国际教育主题分享与规划支持": "Partnering with Financial Institutions and Private Banking to Support High-Net-Worth Families",
    "星系国际教育与银行及私人银行客户服务场景保持合作，围绕子女国际化教育、新加坡精英教育路径、政府奖学金申请与海外名校衔接举办主题沙龙和客户活动。": "We cooperate with banks and private banking client-service settings to host salons and client activities around children's global education, Singapore elite pathways, government scholarships, and global university progression.",
    "招商银行国际教育主题沙龙现场，围绕子女教育规划与新加坡升学路径进行分享。": "China Merchants Bank international education salon, sharing child education planning and Singapore pathways.",
    "高净值家庭服务": "High-Net-Worth Family Services",
    "结合私人银行客户家庭需求，提供国际教育路径、申请节奏和政策要点说明。": "Explain global education pathways, application timing, and policy points around private banking family needs.",
    "在银行沙龙和客户活动中提供主题分享，帮助家庭理解新加坡教育体系及后续海外衔接机会。": "Provide thematic sharing at bank salons and client events to help families understand Singapore's education system and overseas progression opportunities.",
    "通过现场讲座、定制咨询和后续服务承接，形成面向高净值家庭的专业教育支持。": "Build professional education support for high-net-worth families through lectures, tailored consultation, and follow-up services.",
    "金融机构合作活动强调可信度与服务承接能力。星系国际教育通过银行与私人银行场景，把复杂的国际教育路径转化为高净值家庭能够理解和决策的规划方案。": "Financial institution activities emphasize credibility and service delivery. We translate complex international education routes into plans that high-net-worth families can understand and decide on.",
    "以下为招商银行、中信银行及私人银行活动现场，重点展示真实沙龙、主题分享和客户沟通场景。": "The following photos show China Merchants Bank, CITIC Bank, and private banking events, highlighting real salons, thematic sharing, and client communication.",
    "招商银行国际教育安全之路沙龙": "China Merchants Bank International Education Safety Path Salon",
    "联合招商银行相关分行开展国际教育主题分享，围绕新加坡教育优势、子女升学规划和家庭资产配置下的教育决策进行交流。": "Co-hosted international education sharing with China Merchants Bank branches around Singapore education strengths, child pathway planning, and education decisions in family asset planning.",
    "招商银行私人银行客户活动": "China Merchants Bank Private Banking Client Event",
    "面向私人银行客户家庭，系统介绍新加坡精英教育路径、申请准备节奏和后续海外名校衔接方向。": "Systematic introduction to Singapore elite education routes, application preparation timing, and global university progression for private banking families.",
    "招商银行活动现场资料": "China Merchants Bank Event Materials",
    "活动现场围绕国际教育规划主题进行视觉呈现，便于客户清晰了解分享议题和服务方向。": "Visual event presentation around international education planning, helping clients understand topics and service directions.",
    "招商银行定制规划沟通": "China Merchants Bank Tailored Planning Discussion",
    "针对高净值家庭关注的升学安全、路径确定性和长期发展，进行更细致的规划说明。": "More detailed planning explanations around education security, pathway certainty, and long-term development for high-net-worth families.",
    "中信银行教育规划分享": "CITIC Bank Education Planning Sharing",
    "在中信银行相关活动中介绍新加坡教育体系、申请政策和国际升学规划，为家庭提供路径参考。": "Introducing Singapore's education system, application policies, and international pathway planning at CITIC Bank activities.",
    "中信私人银行现场交流": "CITIC Private Banking On-Site Exchange",
    "活动现场围绕学生阶段、目标学校、申请材料和家庭规划问题进行沟通，增强后续咨询承接。": "On-site discussions around student stage, target schools, application documents, and family planning questions.",
    "高端家庭教育规划沙龙": "Premium Family Education Planning Salon",
    "面向关注国际化教育的家庭开展专题交流，帮助家长理解不同阶段的规划重点和风险控制。": "Thematic exchange for families focused on global education, helping parents understand priorities and risk control at different stages.",
    "查看合作详情": "View Partnership Details"
  };

  const titleTranslations = {
    "新加坡星系国际教育 | 新加坡教育资源与国际升学规划": "Star Alliance Education Singapore | Singapore Education Resources and Global Pathway Planning",
    "特色案例详情 | 新加坡星系国际教育": "Featured Case Details | Star Alliance Education Singapore",
    "合作伙伴详情 | 新加坡星系国际教育": "Partner Details | Star Alliance Education Singapore"
  };

  function normalize(value) {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function translateTextNode(node, lang) {
    if (!node.nodeValue || !normalize(node.nodeValue)) return;
    if (lang === "zh") {
      if (node.__zhText) node.nodeValue = node.__zhText;
      return;
    }
    if (!node.__zhText) node.__zhText = node.nodeValue;
    const key = normalize(node.__zhText);
    if (!translations[key]) return;
    const leading = node.__zhText.match(/^\s*/)[0];
    const trailing = node.__zhText.match(/\s*$/)[0];
    node.nodeValue = `${leading}${translations[key]}${trailing}`;
  }

  function translateAttributes(lang) {
    const attrs = ["aria-label", "alt", "title"];
    document.querySelectorAll("*").forEach((element) => {
      attrs.forEach((attr) => {
        const value = element.getAttribute(attr);
        if (!value) return;
        const storeKey = `data-i18n-${attr}`;
        if (!element.getAttribute(storeKey)) element.setAttribute(storeKey, value);
        if (lang === "zh") {
          element.setAttribute(attr, element.getAttribute(storeKey));
          return;
        }
        const translated = translations[normalize(element.getAttribute(storeKey))];
        if (translated) element.setAttribute(attr, translated);
      });
    });
  }

  function applyLanguage(lang) {
    const nextLang = lang === "en" ? "en" : "zh";
    document.documentElement.lang = nextLang === "en" ? "en" : "zh-CN";
    document.body.dataset.lang = nextLang;
    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
      button.textContent = nextLang === "en" ? "中文" : "EN";
      button.setAttribute("aria-pressed", String(nextLang === "en"));
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateTextNode(node, nextLang));
    translateAttributes(nextLang);
    if (nextLang === "en") {
      document.title = titleTranslations[document.title] || normalize(document.body.dataset.zhTitle)
        .split(" | ")
        .map((part) => translations[part] || part.replace("新加坡星系国际教育", "Star Alliance Education Singapore"))
        .join(" | ");
    } else if (document.body.dataset.zhTitle) {
      document.title = document.body.dataset.zhTitle;
    }
  }

  function currentLang() {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "en" || param === "zh") return param;
    return localStorage.getItem("starAllianceLang") === "en" ? "en" : "zh";
  }

  document.body.dataset.zhTitle = document.title;
  document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.documentElement.lang === "en" ? "zh" : "en";
      localStorage.setItem("starAllianceLang", next);
      applyLanguage(next);
    });
  });
  applyLanguage(currentLang());
})();
