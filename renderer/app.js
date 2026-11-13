(async () => {
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, a = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(a)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
};
// ---------- i18n: [en, fa, ar] ----------
const T = {
home:['Home','خانه','الرئيسية'],apps:['Applications','برنامه‌ها','التطبيقات'],games:['Games','بازی‌ها','الألعاب'],folders:['Folders','پوشه‌ها','المجلدات'],
favs:['Favorites','علاقه‌مندی‌ها','المفضلة'],monitor:['System Monitor','مانیتور سیستم','مراقب النظام'],settings:['Settings','تنظیمات','الإعدادات'],
add:['Add','افزودن','إضافة'],search:['Search…','جستجو…','بحث…'],launch:['Launch','اجرا','تشغيل'],rename:['Rename','تغییر نام','إعادة تسمية'],
remove:['Remove from launcher','حذف از لانچر','إزالة من المشغّل'],icon:['Change icon','تغییر آیکون','تغيير الأيقونة'],pin:['Pin','سنجاق','تثبيت'],
unpin:['Unpin','برداشتن سنجاق','إلغاء التثبيت'],hide:['Hide','پنهان کردن','إخفاء'],unhide:['Show','نمایش','إظهار'],fav:['Favorite','علاقه‌مندی','المفضلة'],
moveto:['Move to','انتقال به','نقل إلى'],confirm:['Remove this entry? The real app is NOT uninstalled.','این مورد حذف شود؟ برنامه واقعی حذف نمی‌شود.','إزالة هذا العنصر؟ لن يتم حذف التطبيق الفعلي.'],
s_system:['Windows System','سیستم ویندوز','نظام ويندوز'],s_frequent:['Frequently Used','پرکاربرد','الأكثر استخداماً'],s_popular:['Popular Apps','برنامه‌های محبوب','تطبيقات شائعة'],
s_favorites:['My Favorites','علاقه‌مندی‌های من','مفضلتي'],newgroup:['New group','گروه جدید','مجموعة جديدة'],
v_xl:['Extra large icons','آیکون خیلی بزرگ','أيقونات كبيرة جداً'],v_l:['Large icons','آیکون بزرگ','أيقونات كبيرة'],v_m:['Medium icons','آیکون متوسط','أيقونات متوسطة'],
v_s:['Small icons','آیکون کوچک','أيقونات صغيرة'],v_list:['List','لیست','قائمة'],v_details:['Details','جزئیات','تفاصيل'],
o_custom:['Manual order','ترتیب دستی','ترتيب يدوي'],o_name:['Name','نام','الاسم'],o_added:['Date added','تاریخ افزودن','تاريخ الإضافة'],o_last:['Last launched','آخرین اجرا','آخر تشغيل'],o_count:['Most used','پراستفاده‌ترین','الأكثر استخداماً'],
c_type:['Type','نوع','النوع'],c_path:['Path','مسیر','المسار'],c_count:['Launches','تعداد اجرا','مرات التشغيل'],
ty_app:['Application','برنامه','تطبيق'],ty_folder:['Folder','پوشه','مجلد'],ty_url:['Web / URI','وب','ويب'],ty_system:['System','سیستم','نظام'],ty_popular:['Popular','محبوب','شائع'],ty_cmd:['Command','دستور','أمر'],
web:['web','وب','ويب'],never:['Never','هرگز','أبدًا'],cols:['Columns','ستون‌ها','الأعمدة'],resetlayout:['Reset layout','بازنشانی چیدمان','إعادة ضبط التخطيط'],
name:['Name','نام','الاسم'],path_ph:['Path, URL or command','مسیر، آدرس یا دستور','مسار أو رابط أو أمر'],browse_f:['Browse files…','انتخاب فایل…','استعراض الملفات…'],
browse_d:['Browse folders…','انتخاب پوشه…','استعراض المجلدات…'],isgame:['This is a game','این یک بازی است','هذه لعبة'],section:['Section','بخش','القسم'],
cancel:['Cancel','انصراف','إلغاء'],save:['Save','ذخیره','حفظ'],dup:['Already in list','قبلاً در لیست است','موجود مسبقاً'],invalid:['Invalid path','مسیر نامعتبر','مسار غير صالح'],
opened_web:['Opened website (app not installed)','وب‌سایت باز شد (برنامه نصب نیست)','تم فتح الموقع (التطبيق غير مثبت)'],missing:['File not found','فایل پیدا نشد','الملف غير موجود'],
droptip:['Tip: you can drop files or folders anywhere in the window.','نکته: فایل‌ها و پوشه‌ها را می‌توانید در هر جای پنجره رها کنید.','نصيحة: يمكنك إسقاط الملفات والمجلدات في أي مكان بالنافذة.'],
empty:['Nothing here yet','هنوز چیزی نیست','لا شيء هنا بعد'],showHidden:['Show/hide hidden items','نمایش/پنهان موارد مخفی','إظهار/إخفاء العناصر المخفية'],delwidget:['Delete group','حذف گروه','حذف المجموعة'],
g_general:['General','عمومی','عام'],language:['Language','زبان','اللغة'],theme:['Theme','پوسته','المظهر'],th_system:['Same as system','مطابق سیستم','حسب النظام'],th_dark:['Dark','تیره','داكن'],th_light:['Light','روشن','فاتح'],
tray:['Minimize to tray on close','کوچک شدن به سینی هنگام بستن','التصغير إلى الدرج عند الإغلاق'],autostart:['Launch on Windows startup','اجرا با شروع ویندوز','التشغيل عند بدء ويندوز'],
interval:['Refresh interval (seconds)','بازه به‌روزرسانی (ثانیه)','فترة التحديث (ثانية)'],sensors:['Visible sensors','حسگرهای نمایان','المستشعرات المرئية'],
dupes:['Detect duplicates','تشخیص موارد تکراری','اكتشاف التكرار'],defview:['Default view','نمای پیش‌فرض','العرض الافتراضي'],defsort:['Default sorting','مرتب‌سازی پیش‌فرض','الترتيب الافتراضي'],
backup:['Backup…','پشتیبان‌گیری…','نسخة احتياطية…'],restore:['Restore…','بازیابی…','استعادة…'],reset:['Reset everything','بازنشانی همه','إعادة ضبط الكل'],
imp:['Import patchapss.json…','وارد کردن patchapss.json…','استيراد patchapss.json…'],data:['Data','داده‌ها','البيانات'],
cpu:['CPU','پردازنده','المعالج'],gpu:['GPU','کارت گرافیک','كرت الشاشة'],ram:['RAM','حافظه','الذاكرة'],disk:['Disk','دیسک','القرص'],net:['Network','شبکه','الشبكة'],
temp:['Temperature','دما','الحرارة'],tunit:['Temperature unit','واحد دما','وحدة الحرارة'],tz:['Alternate timezone','منطقه زمانی دیگر','منطقة زمنية أخرى'],
local:['Local (Windows clock)','محلی (ساعت ویندوز)','محلي (ساعة ويندوز)'],opendate:['Open Windows Date & Time settings','باز کردن تنظیمات تاریخ و زمان ویندوز','فتح إعدادات التاريخ والوقت'],
na:['N/A','در دسترس نیست','غير متاح'],free:['free','آزاد','متاح'],done:['Done','انجام شد','تم'],clocknote:['The clock always follows the Windows system clock. Language only changes the calendar and numerals.','ساعت همیشه از ساعت ویندوز پیروی می‌کند. زبان فقط تقویم و ارقام را تغییر می‌دهد.','الساعة تتبع ساعة ويندوز دائماً. اللغة تغيّر التقويم والأرقام فقط.'],
f_all:['All','همه','الكل'],f_recent:['Recently added','اخیراً افزوده','أضيفت مؤخراً'],f_freq:['Frequently used','پرکاربرد','الأكثر استخداماً'],
readwrite:['Read / Write','خواندن / نوشتن','قراءة / كتابة'],vram:['VRAM','حافظه گرافیکی','ذاكرة الشاشة'],
sys_thispc:['This PC','رایانه','هذا الكمبيوتر'],sys_recycle:['Recycle Bin','سطل بازیافت','سلة المحذوفات'],sys_control:['Control Panel','کنترل پنل','لوحة التحكم'],
sys_settings:['Windows Settings','تنظیمات ویندوز','إعدادات ويندوز'],sys_store:['Microsoft Store','مایکروسافت استور','متجر Microsoft'],sys_xbox:['Xbox','ایکس‌باکس','Xbox'],
sys_explorer:['File Explorer','فایل اکسپلورر','مستكشف الملفات'],sys_taskmgr:['Task Manager','مدیر وظیفه','إدارة المهام'],sys_terminal:['Windows Terminal','ترمینال ویندوز','Windows Terminal'],
sys_cmd:['Command Prompt','خط فرمان','موجه الأوامر'],sys_powershell:['PowerShell','پاورشل','PowerShell'],sys_devmgr:['Device Manager','مدیر دستگاه','إدارة الأجهزة'],sys_network:['Network Settings','تنظیمات شبکه','إعدادات الشبكة'],
video:['Video Player','ویدئو پلیر','مشغل الفيديو'],music:['Music Player','موزیک پلیر','مشغل الموسيقى'],
mp_files:['Add files…','افزودن فایل…','إضافة ملفات…'],mp_folder:['Add folder…','افزودن پوشه…','إضافة مجلد…'],mp_clear:['Clear list','پاک کردن لیست','مسح القائمة'],
mp_empty:['Add files, or drop them here','فایل اضافه کنید یا اینجا رها کنید','أضف ملفات أو أسقطها هنا'],
resume_q:['You have played this before.','قبلاً این را پخش کرده‌اید.','لقد شغّلت هذا من قبل.'],resume_cont:['Continue from previous playback','ادامه از پخش قبلی','المتابعة من التشغيل السابق'],
resume_start:['Play from the beginning','پخش از ابتدا','التشغيل من البداية'],sub_l:['Subtitles','زیرنویس','الترجمة'],sub_off:['Off','خاموش','إيقاف'],
sub_load:['Load subtitle file…','بارگذاری فایل زیرنویس…','تحميل ملف الترجمة…'],sub_busy:['Looking for subtitles…','در حال یافتن زیرنویس…','جارٍ البحث عن الترجمة…'],
sub_none:['No text subtitles found','زیرنویس متنی پیدا نشد','لم يتم العثور على ترجمة نصية'],sub_img:['Image-based subtitles (PGS/DVD) cannot be shown','زیرنویس تصویری (PGS/DVD) قابل نمایش نیست','الترجمة المصورة (PGS/DVD) غير مدعومة'],
sub_noff:['ffmpeg missing: embedded subtitles unavailable','ffmpeg موجود نیست: زیرنویس داخل فایل در دسترس نیست','ffmpeg غير موجود: الترجمة المدمجة غير متاحة'],
nofmt:['This file cannot be played here (unsupported codec).','این فایل اینجا پخش نمی‌شود (کدک پشتیبانی نمی‌شود).','لا يمكن تشغيل هذا الملف هنا (ترميز غير مدعوم).'],
opendef:['Open with default player','باز کردن با پلیر پیش‌فرض','فتح بالمشغل الافتراضي'],speed:['Speed','سرعت','السرعة'],
tzfor:['Timezone for this language','منطقه زمانی این زبان','المنطقة الزمنية لهذه اللغة'],tzlocal:['Use the Windows local timezone instead','به‌جای آن از منطقه زمانی ویندوز استفاده شود','استخدام المنطقة الزمنية لويندوز بدلاً من ذلك'],
clocknote2:['By default the clock shows the time of the selected language country (Persian: Tehran, English: London, Arabic: Riyadh). Windows system time is never changed.','به‌طور پیش‌فرض ساعت زمان کشور مربوط به زبان را نشان می‌دهد (فارسی: تهران، انگلیسی: لندن، عربی: ریاض). ساعت ویندوز هرگز تغییر نمی‌کند.','افتراضياً تعرض الساعة وقت بلد اللغة المختارة (الفارسية: طهران، الإنجليزية: لندن، العربية: الرياض). لا يتم تغيير وقت ويندوز أبداً.'],

ty_store:['Store app','برنامه استور','تطبيق المتجر'],st_installed:['Installed apps…','برنامه‌های نصب‌شده…','التطبيقات المثبتة…'],st_none:['Could not read installed apps','خواندن برنامه‌های نصب‌شده ممکن نشد','تعذّر قراءة التطبيقات المثبتة'],
browser:['Workspace','فضای کار','مساحة العمل'],weather:['Weather','آب‌وهوا','الطقس'],look:['Appearance','ظاهر برنامه','المظهر'],
m_left:['left','مانده','متبقي'],m_end:['ends at','پایان در','ينتهي في'],fx_l:['Scene','صحنه','المشهد'],fx_off:['Off','خاموش','إيقاف'],
e_mountain:['Mountain road','جاده کوهستانی','طريق جبلي'],e_desert:['Desert','کویر','صحراء'],e_forest:['Forest','جنگل','غابة'],e_snow:['Snowy pass','گردنه برفی','ممر ثلجي'],e_coast:['Coast','ساحل','شاطئ'],e_city:['City','شهر','مدينة'],
x_sun:['Sunny','آفتابی','مشمس'],x_rain:['Rain','بارانی','ماطر'],x_storm:['Storm','طوفانی','عاصف'],x_fog:['Fog','مه‌آلود','ضباب'],x_snow:['Snow','برفی','ثلج'],x_night:['Night','شب','ليل'],x_sunset:['Sunset','غروب','غروب'],x_neon:['Neon night','شب نئونی','ليل نيون'],
c_side:['Side view','نمای کناری','منظر جانبي'],c_pov:["Driver's view",'دید راننده','منظر السائق'],c_orbit:['Orbit','چرخش دور ماشین','دوران حول السيارة'],
b_new:['New tab','تب جدید','تبويب جديد'],b_ph:['Search or enter address','جستجو یا وارد کردن آدرس','ابحث أو أدخل عنوانًا'],b_bm:['Bookmarks','نشان‌ها','الإشارات'],b_hist:['History','تاریخچه','السجل'],b_dl:['Downloads','دانلودها','التنزيلات'],
b_blk:['Ad & tracker blocker','مسدودکننده تبلیغ و ردیاب','حاجب الإعلانات والمتتبعات'],b_priv:['Private tab','تب خصوصی','تبويب خاص'],b_find:['Find in page','جستجو در صفحه','بحث في الصفحة'],b_dark:['Dark pages','صفحات تیره','صفحات داكنة'],
b_read:['Reader mode','حالت مطالعه','وضع القراءة'],b_dev:['Developer tools','ابزار توسعه‌دهنده','أدوات المطور'],b_vt:['Vertical tabs','تب‌های عمودی','تبويبات عمودية'],b_eng:['Search engine','موتور جستجو','محرك البحث'],
b_clr:['Clear history','پاک کردن تاریخچه','مسح السجل'],b_zin:['Zoom in','بزرگ‌نمایی','تكبير'],b_zout:['Zoom out','کوچک‌نمایی','تصغير'],b_ext:['Open in default browser','باز کردن در مرورگر پیش‌فرض','فتح في المتصفح الافتراضي'],b_empty:['Nothing here','موردی نیست','لا يوجد شيء'],
w_ask:['Use your location for weather?','برای آب‌وهوا از موقعیت شما استفاده شود؟','استخدام موقعك لعرض الطقس؟'],w_allow:['Allow (Windows location)','اجازه (موقعیت ویندوز)','السماح (موقع ويندوز)'],w_manual:['Enter manually','واردکردن دستی','إدخال يدوي'],
w_ip:['Approximate location via internet','موقعیت تقریبی از طریق اینترنت','موقع تقريبي عبر الإنترنت'],w_fail:['Windows location is off or unavailable.','موقعیت ویندوز خاموش یا در دسترس نیست.','موقع ويندوز متوقف أو غير متاح.'],w_search:['Search city…','جستجوی شهر…','ابحث عن مدينة…'],
w_feels:['Feels like','احساس‌شده','الشعور'],w_hum:['Humidity','رطوبت','الرطوبة'],w_wind:['Wind','باد','الرياح'],w_press:['Pressure','فشار','الضغط'],w_uv:['UV index','شاخص UV','مؤشر UV'],w_sun:['Sunrise / Sunset','طلوع / غروب','الشروق / الغروب'],
w_hour:['Next 24 hours','۲۴ ساعت آینده','الـ 24 ساعة القادمة'],w_day:['7-day forecast','پیش‌بینی ۷ روزه','توقعات 7 أيام'],w_err:['Could not load weather (check internet).','دریافت آب‌وهوا ممکن نشد (اینترنت را بررسی کنید).','تعذّر تحميل الطقس (تحقق من الإنترنت).'],
w_cur:['Change location','تغییر موقعیت','تغيير الموقع'],w_my:['My location','موقعیت من','موقعي'],w_save:['Saved places','مکان‌های ذخیره‌شده','الأماكن المحفوظة'],
wc_clear:['Clear','صاف','صافٍ'],wc_part:['Partly cloudy','نیمه ابری','غائم جزئياً'],wc_cloud:['Cloudy','ابری','غائم'],wc_fog:['Fog','مه','ضباب'],wc_drz:['Drizzle','نم‌نم باران','رذاذ'],wc_rain:['Rain','باران','مطر'],wc_snow:['Snow','برف','ثلج'],wc_thun:['Thunderstorm','رعد و برق','عاصفة رعدية'],
l_scheme:['Color schemes','طرح‌های رنگی','أنظمة الألوان'],l_layout:['Layout','چیدمان','التخطيط'],l_den:['Density','تراکم','الكثافة'],l_cozy:['Cozy','معمولی','عادي'],l_compact:['Compact','فشرده','مضغوط'],l_roomy:['Spacious','باز','واسع'],
l_nav:['Navigation','ناوبری','التنقل'],l_side:['Sidebar','نوار کناری','شريط جانبي'],l_top:['Top bar','نوار بالا','شريط علوي'],l_rad:['Corner radius','گردی گوشه‌ها','استدارة الزوايا'],l_glass:['Glass effect','افکت شیشه‌ای','تأثير زجاجي'],l_font:['Text size','اندازه متن','حجم النص'],
l_cust:['Custom colors','رنگ‌های دلخواه','ألوان مخصصة'],l_sv:['Save as new scheme…','ذخیره به‌عنوان طرح جدید…','حفظ كنظام جديد…'],l_name:['Scheme name','نام طرح','اسم النظام'],l_def:['Default','پیش‌فرض','افتراضي'],
c_ac:['Accent','رنگ اصلی','اللون الرئيسي'],c_bg:['Background','پس‌زمینه','الخلفية'],c_pn:['Panels','پنل‌ها','اللوحات'],c_tx:['Text','متن','النص'],c_mu:['Muted text','متن کم‌رنگ','نص خافت'],c_bd:['Borders','حاشیه‌ها','الحدود'],
sc_ocean:['Ocean','اقیانوس','المحيط'],sc_emerald:['Emerald','زمرد','زمرد'],sc_sunset:['Sunset','غروب','غروب'],sc_rose:['Rose','رز','وردي'],sc_sand:['Sand','شن','رمل'],sc_midnight:['Midnight','نیمه‌شب','منتصف الليل'],sc_cyber:['Cyber','سایبر','سايبر'],sc_mono:['Mono','تک‌رنگ','أحادي'],

apps_only:['Applications only (not on Home)','فقط در برنامه‌ها (نه در خانه)','التطبيقات فقط (ليس في الرئيسية)'],sys_only:['This section is only for Windows system apps','این بخش فقط برای برنامه‌های سیستمی ویندوز است','هذا القسم لتطبيقات نظام ويندوز فقط'],sys_stay:['System apps stay in the System section','برنامه‌های سیستمی در بخش سیستم می‌مانند','تطبيقات النظام تبقى في قسم النظام'],
s_web:['Web Apps','برنامه‌های تحت وب','تطبيقات الويب'],f_web:['Web apps','برنامه‌های تحت وب','تطبيقات الويب'],s_webopen:['Open web apps in','باز کردن برنامه‌های وب در','فتح تطبيقات الويب في'],s_inbr:['Built-in browser','مرورگر داخلی','المتصفح المدمج'],s_sysbr:['Default browser','مرورگر پیش‌فرض','المتصفح الافتراضي'],
downloads:['Downloads','دانلودها','التنزيلات'],dm_add:['Add download','افزودن دانلود','إضافة تنزيل'],dm_urls:['One link per line. Batch: file[01-20].jpg','هر لینک در یک خط. دسته‌ای: file[01-20].jpg','رابط في كل سطر. دفعة: file[01-20].jpg'],dm_conn:['Connections','تعداد اتصال','عدد الاتصالات'],dm_start:['Start now','شروع فوری','ابدأ الآن'],
dm_resumeall:['Start all','شروع همه','ابدأ الكل'],dm_pauseall:['Pause all','توقف همه','إيقاف الكل'],dm_clear:['Clear finished','پاک‌کردن تمام‌شده‌ها','مسح المكتملة'],dm_set:['Download settings','تنظیمات دانلود','إعدادات التنزيل'],dm_max:['Simultaneous downloads','دانلود هم‌زمان','تنزيلات متزامنة'],
dm_limit:['Speed limit (KB/s, 0 = none)','محدودیت سرعت (KB/s، ۰ = نامحدود)','حد السرعة (KB/s، 0 = بلا حد)'],dm_dir:['Save folder','پوشه ذخیره','مجلد الحفظ'],dm_clip:['Watch clipboard for links','پایش لینک‌های کلیپ‌بورد','مراقبة الروابط في الحافظة'],
dm_capture:['Capture downloads from the built-in browser','دریافت دانلودهای مرورگر داخلی','التقاط تنزيلات المتصفح المدمج'],dm_sniff:['Detect videos/audio on pages','تشخیص ویدئو/صدا در صفحات','اكتشاف الفيديو/الصوت في الصفحات'],dm_sched:['Start queue daily at','شروع صف هر روز ساعت','بدء القائمة يومياً في'],
dm_open:['Open file','باز کردن فایل','فتح الملف'],dm_folder:['Show in folder','نمایش در پوشه','إظهار في المجلد'],dm_copy:['Copy link','کپی لینک','نسخ الرابط'],dm_rm:['Remove from list','حذف از لیست','إزالة من القائمة'],dm_rmf:['Delete file too','حذف فایل هم','حذف الملف أيضاً'],
dm_eta:['ETA','زمان باقی‌مانده','المتبقي'],dm_clipq:['Download this link?','این لینک دانلود شود؟','تنزيل هذا الرابط؟'],dm_added:['Added to downloads','به دانلودها اضافه شد','تمت الإضافة للتنزيلات'],
dm_paused:['Paused','متوقف','متوقف'],dm_queued:['Queued','در صف','في الانتظار'],dm_downloading:['Downloading','در حال دانلود','قيد التنزيل'],dm_completed:['Completed','تمام‌شده','مكتمل'],dm_error:['Failed','ناموفق','فشل'],
b_media:['Detected media on page','رسانه‌های شناسایی‌شده','وسائط مكتشفة'],b_edit:['Edit','ویرایش','تعديل'],b_rem:['Remove','حذف','إزالة'],b_rst:['Reset to defaults','بازگشت به پیش‌فرض','استعادة الافتراضي'],
aq_l:['Air quality','کیفیت هوا','جودة الهواء'],aq1:['Good','خوب','جيدة'],aq2:['Moderate','متوسط','متوسطة'],aq3:['Unhealthy for sensitive','ناسالم برای حساسان','غير صحية للحساسين'],aq4:['Unhealthy','ناسالم','غير صحية'],aq5:['Very unhealthy','بسیار ناسالم','سيئة جداً'],aq6:['Hazardous','خطرناک','خطرة'],
w_moon:['Moon','ماه','القمر'],w_gust:['Gusts','تندباد','هبات'],w_cloud:['Cloud cover','پوشش ابر','الغيوم'],w_rainmap:['Rain radar','رادار باران','رادار المطر'],w_windmap:['Wind map','نقشه باد','خريطة الرياح'],w_tempmap:['Temperature map','نقشه دما','خريطة الحرارة'],
fxn_synth:['Synthwave drive','رانندگی سینت‌ویو','قيادة سينثويف'],fxn_warp:['Warp speed','سرعت نور','سرعة الضوء'],fxn_solar:['Solar system','منظومه شمسی','المجموعة الشمسية'],fxn_plane:['Plane above the clouds','هواپیما بالای ابرها','طائرة فوق السحب'],fxn_aurora:['Aurora borealis','شفق قطبی','الشفق القطبي'],
fxn_ocean:['Ocean sunset','غروب اقیانوس','غروب المحيط'],fxn_lofi:['Lo-fi rainy window','پنجره بارانی لوفای','نافذة ماطرة لوفاي'],fxn_eq:['Neon equalizer','اکولایزر نئونی','معادل نيون'],fxn_galaxy:['Spiral galaxy','کهکشان مارپیچ','مجرة حلزونية'],fxn_lava:['Lava lamp','لامپ گدازه','مصباح الحمم'],
fxn_matrix:['Digital rain','باران دیجیتال','مطر رقمي'],fxn_fireflies:['Firefly forest','جنگل کرم شب‌تاب','غابة اليراعات'],fxn_deep:['Deep sea','اعماق دریا','أعماق البحر'],fxn_road1:['Rainy mountain drive','رانندگی کوهستان بارانی','قيادة جبلية ماطرة'],fxn_road2:['Desert sunset orbit','چرخش غروب کویر','دوران غروب الصحراء'],

fx_auto:['Auto (matches the track)','خودکار (متناسب با آهنگ)','تلقائي (يناسب المقطع)'],rep_off:['Repeat: off','تکرار: خاموش','التكرار: متوقف'],rep_all:['Repeat: whole list','تکرار: کل لیست','التكرار: القائمة كاملة'],rep_one:['Repeat: this track','تکرار: همین مورد','التكرار: هذا المقطع'],
dm_pause:['Pause','توقف','إيقاف مؤقت'],dm_resume:['Resume','ادامه','استئناف'],
w_model:['Model','مدل','النموذج'],w_avg:['Average of models','میانگین چند مدل','متوسط عدة نماذج'],w_best:['Best match','بهترین تطبیق','الأنسب'],w_avgnote:['Average of ECMWF, GFS and ICON models','میانگین مدل‌های ECMWF، GFS و ICON','متوسط نماذج ECMWF وGFS وICON'],
b_explorer:['Explorer tab','تب مرورگر فایل','تبويب مستكشف الملفات'],b_cols:['Two columns','دو ستونه','عمودان'],b_pin:['Pin tab','سنجاق تب','تثبيت التبويب'],b_unpin:['Unpin tab','برداشتن سنجاق','إلغاء التثبيت'],b_dup:['Duplicate','تکثیر تب','تكرار التبويب'],
b_mute:['Mute tab','بی‌صدا کردن تب','كتم التبويب'],b_unmute:['Unmute tab','صدادار کردن تب','إلغاء الكتم'],b_pane:['Move to the other column','انتقال به ستون دیگر','نقل إلى العمود الآخر'],b_closeo:['Close other tabs','بستن بقیه تب‌ها','إغلاق بقية التبويبات'],
b_reopen:['Reopen closed tab','بازکردن تب بسته‌شده','إعادة فتح تبويب مغلق'],b_ctr:['Container tab','تب محیط جدا','تبويب معزول'],b_print:['Print','چاپ','طباعة'],b_shot:['Screenshot','عکس از صفحه','لقطة شاشة'],b_tr:['Translate page','ترجمه صفحه','ترجمة الصفحة'],
b_aloud:['Read aloud','خواندن با صدا','قراءة بصوت عالٍ'],b_mobile:['Mobile view','نمای موبایل','عرض الجوال'],b_src:['View source','مشاهده سورس','عرض المصدر'],b_pip:['Picture in picture','تصویر در تصویر','صورة داخل صورة'],b_zrst:['Reset zoom','بازنشانی بزرگ‌نمایی','إعادة التكبير'],
b_apps:['Web apps','برنامه‌های وب','تطبيقات الويب'],b_reload:['Reload','بارگذاری مجدد','إعادة التحميل'],
ex_quick:['Quick access','دسترسی سریع','وصول سريع'],ex_mod:['Modified','تاریخ تغییر','تاريخ التعديل'],ex_size:['Size','اندازه','الحجم'],ex_win:['Open in Windows Explorer','باز کردن در اکسپلورر ویندوز','فتح في مستكشف ويندوز'],ex_copy:['Copy path','کپی مسیر','نسخ المسار'],
s_pcin:['Open This PC and folders in','باز کردن رایانه و پوشه‌ها در','فتح هذا الكمبيوتر والمجلدات في'],s_wsp:['Workspace tab','تب فضای کار','تبويب مساحة العمل'],s_winx:['Windows Explorer','اکسپلورر ویندوز','مستكشف ويندوز'],open_ws:['Open in Workspace (web version)','باز کردن در فضای کار (نسخه وب)','فتح في مساحة العمل (نسخة الويب)'],
g_title:['Google sync (Drive)','همگام‌سازی گوگل (درایو)','مزامنة جوجل (درايف)'],g_cid:['OAuth client ID','شناسه کلاینت OAuth','معرّف عميل OAuth'],g_cs:['Client secret','رمز کلاینت','سر العميل'],g_in:['Sign in with Google','ورود با گوگل','تسجيل الدخول بجوجل'],g_out:['Sign out','خروج از حساب','تسجيل الخروج'],
g_ok:['Signed in as','واردشده با','مسجّل باسم'],g_up:['Upload to Drive','ارسال به درایو','رفع إلى درايف'],g_down:['Download from Drive','دریافت از درایو','تنزيل من درايف'],g_done:['Done','انجام شد','تم'],g_err:['Error','خطا','خطأ'],g_overwrite:['Replace local bookmarks, layout and settings with the Drive copy?','نشان‌ها، چیدمان و تنظیمات این دستگاه با نسخه‌ی درایو جایگزین شود؟','استبدال الإشارات والتخطيط والإعدادات المحلية بنسخة درايف؟'],
g_hint:['Syncs bookmarks, speed dial, layout, theme, saved places and your added apps to a private folder in your Google Drive. Needs an OAuth "Desktop app" client (see README). Chrome Sync itself cannot be used by third-party apps.','نشان‌ها، دسترسی سریع، چیدمان، پوسته، مکان‌های ذخیره‌شده و برنامه‌های افزوده‌شده را در یک پوشه‌ی خصوصی گوگل درایو شما همگام می‌کند. به یک کلاینت OAuth از نوع «Desktop app» نیاز دارد (README). همگام‌سازی خود کروم برای برنامه‌های دیگر ممکن نیست.','تتم مزامنة الإشارات والوصول السريع والتخطيط والمظهر والأماكن المحفوظة وتطبيقاتك المضافة إلى مجلد خاص في Google Drive. يتطلب عميل OAuth من نوع Desktop (راجع README). لا يمكن استخدام مزامنة Chrome نفسها.'],

analysis:['Analysis','تحلیل','التحليل'],
an_warn:['⚠ HIGH RISK: trading can lose all of your money. This is an automated, rule-based analysis for education only — not financial advice and not a guarantee of any result. No method can avoid losses. Every trading decision and its outcome is entirely YOUR responsibility.','⚠ ریسک بالا: معامله‌گری می‌تواند تمام سرمایه‌ی شما را از بین ببرد. این تحلیل خودکار و قاعده‌محور است و فقط جنبه‌ی آموزشی دارد؛ توصیه‌ی مالی یا تضمین هیچ نتیجه‌ای نیست. هیچ روشی ضرر را حذف نمی‌کند. مسئولیت هر معامله و نتیجه‌ی آن کاملاً با خود شماست.','⚠ مخاطرة عالية: قد تخسر كل أموالك في التداول. هذا تحليل آلي قائم على قواعد لأغراض تعليمية فقط، وليس نصيحة مالية ولا ضماناً لأي نتيجة. لا توجد طريقة تتجنب الخسائر. كل قرار تداول ونتيجته مسؤوليتك بالكامل.'],
an_sym:['Symbol (XAUUSD, BTCUSDT, طلا…)','نماد (XAUUSD، BTCUSDT، طلا…)','الرمز (XAUUSD, BTCUSDT, ذهب…)'],an_load:['Analyze','تحلیل کن','حلّل'],an_auto:['Auto-refresh every 60 s','به‌روزرسانی خودکار هر ۶۰ ثانیه','تحديث تلقائي كل 60 ثانية'],
an_o_liq:['Liquidity','نقدینگی','السيولة'],an_o_str:['Structure','ساختار','الهيكل'],an_o_zone:['Zones','نواحی','المناطق'],an_o_fc:['Forecast','پیش‌بینی مسیر','التوقع'],an_o_wick:['Stop-hunts','شکار استاپ','صيد الوقف'],an_o_plan:['Plan','پلن','الخطة'],
an_c_up:['Bullish candle','کندل صعودی','شمعة صاعدة'],an_c_dn:['Bearish candle','کندل نزولی','شمعة هابطة'],an_c_grid:['Grid','شبکه','الشبكة'],an_reset:['Reset colors','بازنشانی رنگ‌ها','إعادة الألوان'],
an_bull:['Bullish bias','سوگیری صعودی','انحياز صاعد'],an_bear:['Bearish bias','سوگیری نزولی','انحياز هابط'],an_neut:['Neutral / unclear','خنثی / نامشخص','محايد / غير واضح'],an_conf:['Confidence','اطمینان مدل','ثقة النموذج'],an_horizon:['Forecast horizon','افق پیش‌بینی','أفق التوقع'],
an_plan:['Trade idea (educational)','ایده‌ی معامله (آموزشی)','فكرة صفقة (تعليمية)'],an_entry:['Entry','ورود','الدخول'],an_wait:['Wait for price to reach the zone — do not chase.','صبر کنید قیمت به ناحیه برسد؛ دنبال قیمت نروید.','انتظر وصول السعر إلى المنطقة ولا تلاحقه.'],an_nosetup:['No clean setup — staying out is a valid decision.','ستاپ تمیزی وجود ندارد؛ وارد نشدن هم تصمیم درستی است.','لا توجد فرصة واضحة؛ عدم الدخول قرار سليم.'],
an_wicks:['Likely stop-hunt zones (wicks)','نواحی محتمل شکار استاپ (سایه‌ها)','مناطق صيد الوقف المحتملة (الظلال)'],an_sweepf:['Stop-hunt tendency on this chart','تمایل شکار استاپ در این نمودار','ميل صيد الوقف في هذا الرسم'],
an_bt:['Rule hit-rate on loaded history','نرخ درستی قاعده روی تاریخچه‌ی بارگذاری‌شده','نسبة صحة القاعدة على السجل المحمّل'],an_vs:['vs naive','در برابر حدس ساده','مقابل التخمين البسيط'],an_btnote:['Past accuracy does not predict the future; a hit-rate near the naive value means no real edge.','دقت گذشته آینده را تضمین نمی‌کند؛ اگر نزدیک حدس ساده باشد یعنی مزیت واقعی ندارد.','الدقة السابقة لا تضمن المستقبل؛ القرب من التخمين البسيط يعني عدم وجود ميزة حقيقية.'],
an_cal:['High-impact news (next 48 h)','اخبار مهم (۴۸ ساعت آینده)','أخبار مهمة (48 ساعة)'],an_news:['Headlines','تیترهای خبری','العناوين'],an_sent:['Headline sentiment (rough)','احساس تیترها (تقریبی)','مزاج العناوين (تقريبي)'],an_src:['Data source','منبع داده','مصدر البيانات'],
an_hint:['Scroll to zoom · drag to pan · double-click to reset','اسکرول برای زوم · کشیدن برای جابه‌جایی · دابل‌کلیک برای بازنشانی','تمرير للتكبير · سحب للتحريك · نقر مزدوج للإعادة'],an_few:['Not enough data for this symbol / timeframe.','داده‌ی کافی برای این نماد / تایم‌فریم نیست.','لا توجد بيانات كافية لهذا الرمز / الإطار.'],
an_usd:['Enter the USD price in Toman to see the Iranian gold chart.','برای نمودار طلای ایران قیمت دلار (تومان) را وارد کنید.','أدخل سعر الدولار بالتومان لعرض رسم الذهب الإيراني.'],an_usdl:['USD (Toman)','دلار (تومان)','الدولار (تومان)'],an_iran:['Iran market (best effort)','بازار ایران (تا حد امکان)','السوق الإيراني (قدر الإمكان)'],
an_iran_na:['Live Iranian prices are unavailable right now; enter the USD rate manually.','قیمت زنده‌ی بازار ایران فعلاً در دسترس نیست؛ نرخ دلار را دستی وارد کنید.','الأسعار الإيرانية المباشرة غير متاحة؛ أدخل سعر الدولار يدوياً.'],
an_derived:['Derived from global gold × USD rate; it does not include the Iranian market premium.','از روی طلای جهانی × نرخ دلار محاسبه می‌شود و حباب بازار ایران را شامل نمی‌شود.','مشتق من الذهب العالمي × سعر الدولار ولا يشمل علاوة السوق الإيراني.'],
ms_l:['Control style','سبک کنترل‌ها','نمط التحكم'],ms_ring:['Ring','حلقه‌ای','حلقي'],ms_neon:['Neon','نئونی','نيون'],ms_bar:['Bar','نواری','شريط'],ms_pill:['Pill','کپسولی','حبة'],ms_minimal:['Minimal','مینیمال','بسيط'],
fxn_dance:['Dancing crowd','رقص گروهی','رقص جماعي'],fxn_club:['Night club','کلاب شبانه','نادٍ ليلي'],fxn_fireworks:['Fireworks','آتش‌بازی','ألعاب نارية'],fxn_tunnel:['Neon tunnel','تونل نئونی','نفق نيون'],fxn_vinyl:['Spinning vinyl','صفحه‌ی گرامافون','أسطوانة دوارة'],fxn_ripples:['Pulse rings','حلقه‌های ضربان','حلقات نابضة'],fxn_birds:['Flock at sunset','پرندگان در غروب','طيور عند الغروب'],fxn_campfire:['Campfire','آتش کمپ','نار المخيم'],
s_eco:['Power saving','صرفه‌جویی در مصرف','توفير الطاقة'],eco_auto:['Auto (on battery)','خودکار (روی باتری)','تلقائي (على البطارية)'],eco_on:['Always on','همیشه روشن','دائماً'],eco_off:['Off','خاموش','متوقف'],
defapps:['Default apps','برنامه‌های پیش‌فرض','التطبيقات الافتراضية'],defapps_txt:['Windows does not let an app make itself the default. Open Windows Default apps and choose SEN Launcher for web links (browser) and for video / audio file types. Links opened from other programs then load in the Workspace tab and downloads are captured by the download manager.','ویندوز اجازه نمی‌دهد برنامه خودش را پیش‌فرض کند. تنظیمات برنامه‌های پیش‌فرض ویندوز را باز کنید و SEN Launcher را برای لینک‌های وب (مرورگر) و فایل‌های ویدئو و صدا انتخاب کنید. بعد از آن لینک‌هایی که از برنامه‌های دیگر باز می‌شوند در تب فضای کار باز می‌شوند و دانلودها به دانلود منیجر می‌روند.','لا يسمح ويندوز للتطبيق بتعيين نفسه افتراضياً. افتح إعدادات التطبيقات الافتراضية واختر SEN Launcher لروابط الويب (المتصفح) وملفات الفيديو والصوت. ستُفتح الروابط في مساحة العمل وتلتقط التنزيلات في مدير التنزيل.'],defapps_btn:['Open Windows Default apps','باز کردن تنظیمات برنامه‌های پیش‌فرض ویندوز','فتح إعدادات التطبيقات الافتراضية'],
};
T.s_popular = ['Windows Apps', 'برنامه‌های ویندوز', 'تطبيقات ويندوز'];
const LI = { en: 0, fa: 1, ar: 2 };
const VIEWS = ['xl', 'l', 'm', 's', 'list', 'details'], SZ = { xl: 96, l: 64, m: 48, s: 28, list: 20, details: 20 };
const SORTS = ['custom', 'name', 'added', 'last', 'count'];

const DEF = () => ({
  v: 1, items: [], cols: 2, widths: [1, 1, 1], tv: {}, media: { pos: {}, video: { list: [], i: -1 }, music: { list: [], i: -1 } },
  look: { scheme: 'default', custom: [], layout: { nav: 'side', den: 'cozy', radius: 14, glass: 55, font: 100 } },
  b: { dial: null, engine: 'google', bm: [], hist: [], adblock: true, dark: false, vt: false, panel: null, dl: [], sess: [] }, weather: { loc: null, saved: [], cache: null },
  an: { sym: 'XAUUSD', tf: '15m', auto: true, usd: 0, colors: { bg: '#000000', up: '#00c853', dn: '#ff1744', grid: '#141414', tx: '#8a8f98' }, ov: { ob: 1, fvg: 1, liq: 1, str: 1, zone: 1, fc: 1, wick: 1, plan: 1 } },
  widgets: [
    { id: 'system', kind: 'system', col: 0, view: 'm', sort: 'custom', h: 0 },
    { id: 'popular', kind: 'popular', col: 0, view: 'm', sort: 'custom', h: 0 },
    { id: 'frequent', kind: 'frequent', col: 1, view: 'l', sort: 'custom', h: 0 },
    { id: 'web', kind: 'web', col: 1, view: 'm', sort: 'custom', h: 0 },
    { id: 'favorites', kind: 'favorites', col: 1, view: 'l', sort: 'custom', h: 0 }
  ],
  s: { lang: 'en', theme: 'system', tray: true, autostart: false, interval: 3, sensors: { cpu: 1, gpu: 1, ram: 1, disk: 1, net: 1 }, tf: 'C', dupes: true, sort: 'custom', view: 'm', tzl: { fa: 'Asia/Tehran', en: 'Europe/London', ar: 'Asia/Riyadh' }, local: false, sb: true, fx: 0, webOpen: 'builtin', pcIn: 'workspace', eco: 'auto', mstyle: 'ring' }
});
let D = DEF(), boot = { pop: [] }, mon = null, monInfo = {}, tab = 'home', drag = null, filt = 'all', q = '', monOpen = false;
const t = k => { const v = T[k]; return v ? (v[LI[D.s.lang]] || v[0]) : k; };
let st; const save = () => { clearTimeout(st); st = setTimeout(() => api.save(D), 250); };
const dn = it => it.renamed || it.type !== 'system' ? it.name : t('sys_' + it.id.slice(4));
const wt = w => w.kind === 'group' ? w.title : t('s_' + w.kind);
const loc = () => ({ en: 'en-US-u-ca-gregory', fa: 'fa-IR-u-ca-persian', ar: 'ar-SA-u-ca-islamic-umalqura-nu-arab' })[D.s.lang];
const tzv = () => D.s.local ? undefined : (D.s.tzl || {})[D.s.lang];
const FMT = {};
const fmtc = (o, z) => { const k = loc() + JSON.stringify(o) + z; return FMT[k] || (FMT[k] = new Intl.DateTimeFormat(loc(), { ...o, timeZone: z })); };
const fmtD = ts => ts ? fmtc({ dateStyle: 'medium' }, tzv()).format(ts) : t('never');

const SYSI = [['thispc','This PC','🖥️'],['recycle','Recycle Bin','🗑️'],['control','Control Panel','🎛️'],['settings','Windows Settings','⚙️'],['store','Microsoft Store','🛍️'],['xbox','Xbox','🎮'],
['explorer','File Explorer','','%SystemRoot%\\explorer.exe'],['taskmgr','Task Manager','','%SystemRoot%\\System32\\Taskmgr.exe'],['terminal','Windows Terminal','⌨️'],
['cmd','Command Prompt','','%SystemRoot%\\System32\\cmd.exe'],['powershell','PowerShell','','%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'],['devmgr','Device Manager','🔧'],['network','Network Settings','🌐']];
const WEBI = [['telegram', 'Telegram Web', 'https://web.telegram.org/', 'telegram'], ['instagram', 'Instagram', 'https://www.instagram.com/', 'instagram'], ['whatsapp', 'WhatsApp Web', 'https://web.whatsapp.com/', 'whatsapp'], ['youtube', 'YouTube', 'https://www.youtube.com/', 'youtube'],
  ['spotify', 'Spotify Web', 'https://open.spotify.com/', 'spotify'], ['discord', 'Discord Web', 'https://discord.com/app', 'discord'], ['gmail', 'Gmail', 'https://mail.google.com/'], ['x', 'X (Twitter)', 'https://x.com/'], ['facebook', 'Facebook', 'https://www.facebook.com/'],
  ['linkedin', 'LinkedIn', 'https://www.linkedin.com/'], ['reddit', 'Reddit', 'https://www.reddit.com/'], ['github', 'GitHub', 'https://github.com/'], ['chatgpt', 'ChatGPT', 'https://chatgpt.com/'], ['netflix', 'Netflix', 'https://www.netflix.com/'], ['twitch', 'Twitch', 'https://www.twitch.tv/']];
function seed() {
  const has = new Set(D.items.map(i => i.id)), now = Date.now();
  SYSI.forEach(([id, name, em, ip]) => { if (!has.has('sys:' + id)) D.items.push({ id: 'sys:' + id, name, type: 'system', path: '', emoji: em, iconPath: ip || '', widget: 'system', added: now, last: 0, count: 0 }); });
  boot.pop.forEach(p => { if (!has.has(p.id)) D.items.push({ id: p.id, name: p.name, type: 'popular', path: '', widget: 'popular', added: now, last: 0, count: 0 }); });
  WEBI.forEach(([id, name, url, gl]) => { if (!has.has('web:' + id)) D.items.push({ id: 'web:' + id, name, type: 'web', path: url, glyph: gl || '', widget: 'web', added: now, last: 0, count: 0 }); });
}
function applyLoaded(o) {
  const d = DEF();
  D = { ...d, ...o, s: { ...d.s, ...(o.s || {}), sensors: { ...d.s.sensors, ...((o.s || {}).sensors || {}) } }, tv: { ...(o.tv || {}) } };
  if (!Array.isArray(D.items)) D.items = []; if (!Array.isArray(D.widgets) || !D.widgets.length) D.widgets = d.widgets;
  D.media = { ...d.media, ...(D.media || {}) };
  ['video', 'music'].forEach(k => { D.media[k] = D.media[k] || { list: [], i: -1 }; }); D.media.pos = D.media.pos || {};
  D.s.tzl = { ...d.s.tzl, ...(D.s.tzl || {}) }; D.cols = Math.min(2, Math.max(1, D.cols | 0 || 2));
  seed();
  if (!D.m) { const keep = ['pop:telegram', 'pop:spotify', 'pop:discord', 'pop:youtube', 'pop:chrome']; D.items.forEach(i => { if (i.type === 'popular' && !keep.includes(i.id)) i.hidden = true; }); D.m = 1; }
  D.look = { ...d.look, ...(D.look || {}), layout: { ...d.look.layout, ...((D.look || {}).layout || {}) } }; D.look.custom = D.look.custom || [];
  D.b = { ...d.b, ...(D.b || {}) }; D.weather = { ...d.weather, ...(D.weather || {}) };
  D.an = { ...d.an, ...(D.an || {}), colors: { ...d.an.colors, ...((D.an || {}).colors || {}) }, ov: { ...d.an.ov, ...((D.an || {}).ov || {}) } };
  if ((D.m | 0) < 3) {
    const d3 = DEF(); ['frequent', 'web'].forEach(k => { if (!D.widgets.some(w => w.kind === k)) D.widgets.push(d3.widgets.find(w => w.kind === k)); });
    const pw = D.widgets.find(w => w.kind === 'popular'); if (pw) pw.sort = 'custom';
    D.items.forEach(i => { if (i.type === 'popular') i.hidden = false; if (i.type === 'url' && /^https?:/i.test(i.path)) i.type = 'web'; }); seed(); D.m = 3;
  }
  if ((D.m | 0) < 4) { D.s.fx = -2; D.m = 4; }
  D.colc = D.colc || [];
  if ((D.m | 0) < 2) { D.widgets = D.widgets.filter(w => w.kind !== 'frequent'); const pw = D.widgets.find(w => w.kind === 'popular'); if (pw) pw.sort = 'count'; D.m = 2; }
}

// ---------- helpers: toast / modal / menu ----------
const toast = m => { const e = h('div', { class: 'toast' }, m); document.body.append(e); setTimeout(() => e.remove(), 2800); };
function modal(title, content, actions) {
  return new Promise(res => {
    const m = h('div', { class: 'ov' });
    const close = v => { m.remove(); res(v); };
    m.append(h('div', { class: 'md' }, h('h3', {}, title), typeof content === 'function' ? content(close) : content,
      h('div', { class: 'ma' }, actions.map(([l, v, c]) => h('button', { class: c || '', onclick: () => close(typeof v === 'function' ? v() : v) }, l)))));
    m._close = close; m.addEventListener('mousedown', e => { if (e.target === m) close(null); });
    document.body.append(m); const i = m.querySelector('input'); if (i) i.focus();
  });
}
const ask = async (title, val = '') => {
  const i = h('input', { value: val }); i.onkeydown = e => { if (e.key === 'Enter') i.closest('.md').querySelector('.pr').click(); };
  return modal(title, i, [[t('cancel'), null], [t('save'), () => i.value.trim(), 'pr']]);
};
const yes = m => modal(m, '', [[t('cancel'), false], ['OK', true, 'pr']]);
const sel = (opts, val, on) => h('select', { onchange: e => on(e.target.value) }, opts.map(([v, l]) => h('option', { value: v, selected: v === val }, l)));
const closeMenu = () => document.querySelectorAll('.cm').forEach(x => x.remove());

// ---------- icons ----------
const IC = new Map();
const GL = {
  telegram: '<rect width="48" height="48" rx="11" fill="#27a7e7"/><path fill="#fff" d="M10 23l27-11-4.5 24-7.5-5.5-4 4v-7l12-11-15 9z"/>',
  instagram: '<defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".4" stop-color="#d62976"/><stop offset="1" stop-color="#4f5bd5"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#g)"/><rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31" cy="17" r="1.8" fill="#fff"/>',
  spotify: '<rect width="48" height="48" rx="11" fill="#1db954"/><g fill="none" stroke="#0b2d16" stroke-width="3.2" stroke-linecap="round"><path d="M12 19c8-2.5 17-2 24 2"/><path d="M13 26c7-2 14-1.5 20 2"/><path d="M14.5 32.5c6-1.7 11-1.2 16 1.5"/></g>',
  whatsapp: '<rect width="48" height="48" rx="11" fill="#25d366"/><path d="M24 11a12.5 12.5 0 00-10.7 18.9L11.5 37l7.3-1.8A12.5 12.5 0 1024 11z" fill="none" stroke="#fff" stroke-width="2.8"/><path fill="#fff" d="M19 18c0 6 5 11 11 11l1.7-2.7-3.6-1.8-1.6 1.3c-1.7-.8-3.3-2.4-4.1-4.1l1.3-1.6-1.8-3.6z"/>',
  discord: '<rect width="48" height="48" rx="11" fill="#5865f2"/><path fill="#fff" d="M13 16c3-2 6-3 8-3l1 2h4l1-2c2 0 5 1 8 3 3 6 4 12 3 18-3 2-6 3-8 3l-1.5-3h-8L18 37c-2 0-5-1-8-3-1-6 0-12 3-18z"/><circle cx="19" cy="26" r="3" fill="#5865f2"/><circle cx="29" cy="26" r="3" fill="#5865f2"/>',
  youtube: '<rect width="48" height="48" rx="11" fill="#fff"/><rect x="6" y="12" width="36" height="24" rx="8" fill="#ff0000"/><path fill="#fff" d="M20 18v12l11-6z"/>',
  steam: '<rect width="48" height="48" rx="11" fill="#171a21"/><circle cx="30" cy="19" r="7" fill="none" stroke="#fff" stroke-width="3"/><circle cx="18" cy="31" r="5" fill="none" stroke="#fff" stroke-width="3"/><path d="M22 28l5-4" stroke="#fff" stroke-width="3"/>',
  epic: '<rect width="48" height="48" rx="11" fill="#2a2a2a"/><path d="M13 11h22v22l-11 7-11-7z" fill="#fff"/><text x="24" y="31" font-size="16" font-weight="700" text-anchor="middle" fill="#2a2a2a" font-family="Arial">E</text>',
  chrome: '<rect width="48" height="48" rx="11" fill="#fff"/><path d="M24 24L9.3 15.5A17 17 0 0138.7 15.5z" fill="#ea4335"/><path d="M24 24L38.7 15.5A17 17 0 0124 41z" fill="#fbbc05"/><path d="M24 24L24 41A17 17 0 019.3 15.5z" fill="#34a853"/><circle cx="24" cy="24" r="8" fill="#fff"/><circle cx="24" cy="24" r="6" fill="#4285f4"/>',
  edge: '<defs><linearGradient id="e" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#35c1f1"/><stop offset="1" stop-color="#0f7ed8"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#e)"/><path d="M12 29a12 12 0 1123 4H20c0 4 4 5 8 4" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>'
};
const glyph = id => GL[id] ? 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' + GL[id] + '</svg>') : null;
function icon(it, sz) {
  const e = h('span', { class: 'ic' }); e.style.setProperty('--z', sz + 'px');
  const pop = it.type === 'popular' ? boot.pop.find(p => p.id === it.id) : null;
  const img = u => { e.className = 'ic'; e.style.background = ''; e.textContent = ''; e.append(h('img', { src: u, draggable: 'false' })); };
  const badge = () => {
    const g = pop && glyph(pop.id.slice(4)); if (g) { img(g); return; }
    if (it.emoji) e.textContent = it.emoji; else if (it.type === 'folder') e.textContent = '📁'; else if (it.type === 'url') e.textContent = '🌐'; else if (it.type === 'cmd') e.textContent = '⌨️';
    else { e.className = 'ic bd'; e.textContent = (dn(it) || '?')[0].toUpperCase(); }
  };
  if (it.icon) { img(it.icon); return e; }
  if (it.type === 'web') {
    const g0 = it.glyph && glyph(it.glyph); if (g0) { img(g0); return e; }
    let hn = ''; try { hn = new URL(it.path).hostname; } catch {}
    if (hn) { img('https://www.google.com/s2/favicons?domain=' + hn + '&sz=128'); const im = e.querySelector('img'); if (im) im.addEventListener('error', () => { e.textContent = ''; badge(); }); return e; }
  }
  let key = null, fn = null;
  if (pop && pop.exe) { key = 'x:' + pop.exe; fn = () => api.icon(pop.exe); }
  else if (pop && pop.appid) { key = 'a:' + pop.appid; fn = () => api.iconApp(pop.appid); }
  else if (it.type === 'store') { key = 'a:' + it.path; fn = () => api.iconApp(it.path); }
  else if (it.type === 'system' && it.iconPath) { key = 'x:' + it.iconPath; fn = () => api.icon(it.iconPath); }
  else if ((it.type === 'app' || it.type === 'folder') && it.path) { key = 'x:' + it.path; fn = () => api.icon(it.path); }
  if (!key) { badge(); return e; }
  if (IC.has(key)) { IC.get(key) ? img(IC.get(key)) : badge(); } else { badge(); fn().then(u => { IC.set(key, u); if (u) img(u); }); }
  return e;
}

// ---------- items ----------
const sortItems = (a, m) => {
  const c = [...a];
  if (m === 'name') c.sort((x, y) => dn(x).localeCompare(dn(y), D.s.lang));
  else if (m === 'added') c.sort((x, y) => y.added - x.added);
  else if (m === 'last') c.sort((x, y) => y.last - x.last);
  else if (m === 'count') c.sort((x, y) => y.count - x.count);
  return c;
};
const isWeb = it => it.type === 'popular' && boot.pop.find(p => p.id === it.id && p.via === 'web');
function collection(items, view, opt = {}) {
  if (!items.length) return h('div', { class: 'empty' }, t('empty'));
  const dr = opt.noDrag ? null : 'true';
  const cls = it => (it.hidden ? ' dim' : '');
  if (view === 'details') return h('table', { class: 'dt' }, h('thead', {}, h('tr', {}, ['name', 'c_type', 'c_path', 'o_added', 'o_last', 'c_count'].map(k => h('th', {}, t(k))))),
    h('tbody', {}, items.map(it => h('tr', { class: cls(it).trim(), 'data-iid': it.id, draggable: dr },
      h('td', {}, icon(it, 20), dn(it)), h('td', {}, t('ty_' + it.type)), h('td', { class: 'pth' }, it.path || '—'), h('td', {}, fmtD(it.added)), h('td', {}, fmtD(it.last)), h('td', {}, String(it.count))))));
  return h('div', { class: 'tiles v-' + view }, items.map(it => h('div', { class: 'tile' + cls(it), 'data-iid': it.id, draggable: dr, title: it.path || dn(it) },
    icon(it, SZ[view]), h('span', { class: 'nm' }, dn(it)), isWeb(it) ? h('i', { class: 'web' }, t('web')) : null)));
}
function openWebItem(u) { openWeb(u); }
const popWeb = it => { const w = WEBI.find(x => 'pop:' + x[0] === it.id); return w ? w[2] : null; };
async function launch(it) {
  if (D.s.pcIn !== 'windows' && ((it.type === 'system' && (it.id === 'sys:thispc' || it.id === 'sys:explorer')) || it.type === 'folder')) { it.count++; it.last = Date.now(); save(); openExplorer(it.type === 'folder' ? it.path : ''); return; }
  if (it.type === 'web' && D.s.webOpen !== 'system') { it.count++; it.last = Date.now(); save(); openWebItem(it.path); return; }
  const r = await api.launch({ type: it.type, id: it.id, path: it.path });
  if (r.ok) { it.count++; it.last = Date.now(); save(); if (r.web) toast(t('opened_web')); if (tab === 'home') render(); }
  else toast(r.error === 'missing' ? t('missing') + ': ' + it.path : (r.error || 'Error'));
}
const builtin = it => it.type === 'system' || it.type === 'popular' || it.id.startsWith('web:');
function itemMenu(e, it) {
  e.preventDefault(); closeMenu();
  const A = [[t('launch'), () => launch(it)], ...(it.type === 'popular' && popWeb(it) ? [[t('open_ws'), () => openWeb(popWeb(it))]] : []),
    [t('rename'), async () => { const n = await ask(t('rename'), dn(it)); if (n) { it.name = n; it.renamed = true; save(); render(); } }],
    [t('icon'), async () => { const u = await api.pick('image'); if (u) { it.icon = u; save(); render(); } }],
    [it.pin ? t('unpin') : t('pin'), () => { it.pin = !it.pin; save(); render(); }],
    [(it.fav ? '★ ' : '☆ ') + t('fav'), () => { it.fav = !it.fav; save(); render(); }],
    [(it.game ? '✓ ' : '') + t('isgame'), () => { it.game = !it.game; save(); render(); }],
    [it.hidden ? t('unhide') : t('hide'), () => { it.hidden = !it.hidden; save(); render(); }],
    ...D.widgets.filter(w => w.kind !== 'frequent' && w.id !== it.widget && (it.type === 'system' ? w.kind === 'system' : w.kind !== 'system')).map(w => [t('moveto') + ' ' + wt(w), () => moveItem(it.id, w.id)]),
    ...(it.widget && it.type !== 'system' ? [[t('apps_only'), () => { it.widget = null; save(); render(); }]] : [])];
  if (!builtin(it)) A.push([t('remove'), async () => { if (await yes(t('confirm'))) { D.items = D.items.filter(x => x !== it); save(); render(); } }]);
  const m = h('div', { class: 'cm' }, A.map(([l, f]) => h('div', { onclick: () => { closeMenu(); f(); } }, l)));
  document.body.append(m);
  m.style.left = Math.min(e.clientX, innerWidth - m.offsetWidth - 6) + 'px'; m.style.top = Math.min(e.clientY, innerHeight - m.offsetHeight - 6) + 'px';
}
async function addPaths(list, o = {}) {
  let n = 0; const w = D.widgets.some(x => x.id === o.widget) ? o.widget : null;
  for (const p of list) {
    const i = await api.info(p);
    if (!i.kind) { toast(t('invalid') + ': ' + p); continue; }
    if (D.s.dupes && D.items.some(x => x.path && x.path.toLowerCase() === i.path.toLowerCase())) { toast(t('dup') + ': ' + i.name); continue; }
    D.items.push({ id: 'u:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name: o.name || i.name, type: i.kind === 'url' && /^https?:/i.test(i.path) ? 'web' : i.kind, path: i.path, widget: w, game: !!o.game, added: Date.now(), last: 0, count: 0 }); n++;
  }
  if (n) { save(); render(); } return n;
}
async function pickStore() {
  const list = await api.apps(); if (!list || !list.length) { toast(t('st_none')); return null; }
  const q = h('input', { placeholder: t('search') }), box = h('div', { class: 'apl' });
  return modal(t('st_installed'), close => { const draw = () => { const f = q.value.toLowerCase(); box.replaceChildren(...list.filter(a => a.name.toLowerCase().includes(f)).slice(0, 150).map(a => h('div', { class: 'pi', onclick: () => close(a) }, a.name))); }; q.oninput = draw; draw(); return h('div', { class: 'frm' }, q, box); }, [[t('cancel'), null]]);
}
async function addStore(a, wid) {
  if (D.s.dupes && D.items.some(x => x.path === a.id)) { toast(t('dup') + ': ' + a.name); return; }
  D.items.push({ id: 'u:' + Date.now().toString(36), name: a.name, type: 'store', path: a.id, widget: D.widgets.some(w => w.id === wid) ? wid : null, added: Date.now(), last: 0, count: 0 }); save(); render();
}
async function addDlg() {
  const p = h('input', { placeholder: t('path_ph') }), nm = h('input', { placeholder: t('name') }), g = h('input', { type: 'checkbox' });
  const ws = sel([['', t('apps_only')], ...D.widgets.filter(w => w.kind !== 'frequent' && w.kind !== 'system').map(w => [w.id, wt(w)])], '', () => {});
  p.onchange = async () => { const i = await api.info(p.value); if (i.kind && !nm.value) nm.value = i.name; };
  const multi = k => async close => { const f = await api.pick(k); if (!f) return; if (f.length === 1) { p.value = f[0]; p.onchange(); } else { await addPaths(f, { widget: ws.value, game: g.checked }); close(false); } };
  const r = await modal(t('add'), close => h('div', { class: 'frm' }, p, nm,
    h('div', { class: 'row' }, h('button', { onclick: () => multi('files')(close) }, t('browse_f')), h('button', { onclick: () => multi('folder')(close) }, t('browse_d')), h('button', { onclick: async () => { const a = await pickStore(); if (a) { await addStore(a, ws.value); close(false); } } }, t('st_installed'))),
    h('label', {}, g, ' ', t('isgame')), h('label', {}, t('section') + ': ', ws), h('small', {}, t('droptip'))), [[t('cancel'), null], [t('add'), () => true, 'pr']]);
  if (r && p.value.trim()) addPaths([p.value], { name: nm.value.trim(), widget: ws.value, game: g.checked || tab === 'games' });
}

// ---------- dashboard ----------
function wItems(w) {
  if (w.kind === 'frequent') {
    const v = D.items.filter(i => !i.hidden && !isWeb(i));
    return [...v.filter(i => i.pin), ...v.filter(i => !i.pin && i.count > 0).sort((a, b) => b.count - a.count)].slice(0, 5);
  }
  let a = D.items.filter(i => i.widget === w.id && (w.showHidden || !i.hidden));
  if (w.kind === 'popular' && !w.showHidden) a = a.filter(i => !isWeb(i));
  return sortItems(a, w.sort);
}
function widgetEl(w) {
  const rtl = D.s.lang !== 'en';
  const arrow = h('button', { class: 'cl', onclick: () => { w.collapsed = !w.collapsed; save(); render(); } }, w.collapsed ? (rtl ? '◂' : '▸') : '▾');
  const body = h('div', { class: 'wb', 'data-wid': w.id }, collection(wItems(w), w.view, {}));
  if (w.h) body.style.height = w.h + 'px';
  let h0 = 0; body.addEventListener('mousedown', () => { h0 = body.offsetHeight; });
  body.addEventListener('mouseup', () => { const n = Math.round(body.offsetHeight); if (h0 && Math.abs(n - h0) > 3) { w.h = n; save(); } });
  const ctl = [sel(VIEWS.map(v => [v, t('v_' + v)]), w.view, v => { w.view = v; save(); render(); })];
  if (w.kind !== 'frequent') ctl.push(sel(SORTS.map(v => [v, t('o_' + v)]), w.sort, v => { w.sort = v; save(); render(); }));
  if (w.kind !== 'frequent') ctl.push(h('button', { title: t('showHidden'), onclick: () => { w.showHidden = !w.showHidden; save(); render(); } }, '👁'));
  if (w.kind === 'group') ctl.push(h('button', { title: t('rename'), onclick: async () => { const n = await ask(t('rename'), w.title); if (n) { w.title = n; save(); render(); } } }, '✎'),
    h('button', { title: t('delwidget'), onclick: async () => { if (await yes(t('delwidget') + '?')) { D.items.forEach(i => { if (i.widget === w.id) i.widget = null; }); D.widgets = D.widgets.filter(x => x !== w); save(); render(); } } }, '✕'));
  return h('section', { class: 'wg' + (w.collapsed ? ' cc' : ''), 'data-w': w.id }, h('div', { class: 'wh' }, arrow, h('span', { class: 'ti', draggable: 'true', 'data-drag-w': w.id }, '⠿ ' + wt(w)), w.collapsed ? null : ctl), w.collapsed ? null : body);
}
function splitter(i) {
  const s = h('div', { class: 'spl' });
  s.onpointerdown = ev => {
    ev.preventDefault(); s.setPointerCapture(ev.pointerId);
    const cs = [...s.parentNode.querySelectorAll(':scope>.col')], tot = cs[i].offsetWidth + cs[i + 1].offsetWidth, sw = D.widths[i] + D.widths[i + 1];
    const x0 = ev.clientX, w0 = cs[i].offsetWidth, sg = document.documentElement.dir === 'rtl' ? -1 : 1;
    s.onpointermove = e => {
      const w = Math.max(160, Math.min(tot - 160, w0 + (e.clientX - x0) * sg));
      D.widths[i] = sw * w / tot; D.widths[i + 1] = sw - D.widths[i];
      cs[i].style.flex = `${D.widths[i]} 1 0`; cs[i + 1].style.flex = `${D.widths[i + 1]} 1 0`;
    };
    s.onpointerup = () => { s.onpointermove = null; save(); };
  };
  return s;
}
const colBtns = () => h('div', { class: 'row' }, [1, 2].map(n => h('button', { class: D.cols === n ? 'pr' : '', onclick: () => { D.cols = n; save(); render(); } }, String(n))));
function resetLayout() { const d = DEF(); D.cols = 2; D.widths = d.widths; D.widgets = d.widgets; D.colc = []; D.items.forEach(i => { if (i.type === 'system') i.widget = 'system'; else if (i.type === 'popular') i.widget = 'popular'; }); save(); render(); }
function home() {
  const cols = h('div', { class: 'cols' }), rtl = D.s.lang !== 'en'; D.colc = D.colc || [];
  for (let c = 0; c < D.cols; c++) {
    if (c) cols.append(splitter(c - 1));
    const cc = !!D.colc[c];
    cols.append(h('div', { class: 'col' + (cc ? ' cc' : ''), 'data-col': c, style: cc ? 'flex:0 0 44px' : `flex:${D.widths[c]} 1 0` },
      h('button', { class: 'colbtn', onclick: () => { D.colc[c] = !cc; save(); render(); } }, cc ? (rtl ? '«' : '»') : (rtl ? '»' : '«')),
      cc ? null : D.widgets.filter(w => !w.hidden && Math.min(w.col, D.cols - 1) === c).map(widgetEl)));
  }
  return h('div', {}, h('div', { class: 'bar2' }, h('button', { class: 'pr', onclick: addDlg }, '＋ ' + t('add')), h('span', {}, t('cols') + ':'), colBtns(),
    h('button', { onclick: async () => { const n = await ask(t('newgroup')); if (n) { D.widgets.push({ id: 'g:' + Date.now(), kind: 'group', title: n, col: 0, view: D.s.view, sort: 'custom', h: 0 }); save(); render(); } } }, '▦ ' + t('newgroup')),
    h('button', { title: '⇕', onclick: () => { const all = D.widgets.every(w => w.collapsed); D.widgets.forEach(w => { w.collapsed = !all; }); save(); render(); } }, '⇕'),
    h('button', { onclick: resetLayout }, t('resetlayout'))), cols);
}
function moveWidget(id, col, y, colEl) {
  const w = D.widgets.find(x => x.id === id); if (!w) return;
  D.widgets = D.widgets.filter(x => x !== w); w.col = col; D.colc = D.colc || []; D.colc[col] = false; let before = null;
  for (const el of colEl.querySelectorAll(':scope>.wg')) { if (el.dataset.w === id) continue; const r = el.getBoundingClientRect(); if (y < r.top + r.height / 2) { before = D.widgets.find(x => x.id === el.dataset.w); break; } }
  if (before) D.widgets.splice(D.widgets.indexOf(before), 0, w); else D.widgets.push(w);
  save(); render();
}
function moveItem(id, wid, beforeId) {
  const w = D.widgets.find(x => x.id === wid); if (!w || w.kind === 'frequent') return;
  const it = D.items.find(x => x.id === id); if (!it) return;
  if (w.kind === 'system' && it.type !== 'system') { toast(t('sys_only')); return; }
  if (it.type === 'system' && w.kind !== 'system') { toast(t('sys_stay')); return; }
  D.items = D.items.filter(x => x !== it); it.widget = wid;
  const b = beforeId && beforeId !== id ? D.items.find(x => x.id === beforeId) : null;
  if (b) D.items.splice(D.items.indexOf(b), 0, it); else D.items.push(it);
  save(); render();
}
// ---------- drag & drop ----------
const clearOver = () => document.querySelectorAll('.over').forEach(x => x.classList.remove('over'));
document.addEventListener('dragstart', e => {
  if (!e.target.closest) return;
  const w = e.target.closest('[data-drag-w]'), it = e.target.closest('[data-iid][draggable=true]');
  if (w) drag = { t: 'w', id: w.dataset.dragW }; else if (it) drag = { t: 'i', id: it.dataset.iid };
  if (drag) { e.dataTransfer.setData('text/plain', drag.t); e.dataTransfer.effectAllowed = 'move'; }
});
document.addEventListener('dragover', e => {
  const files = e.dataTransfer.types.includes('Files');
  if (!drag && !files) return; e.preventDefault(); clearOver();
  const el = drag && drag.t === 'w' ? e.target.closest('.col') : e.target.closest('.wb'); if (el) el.classList.add('over');
});
document.addEventListener('dragend', () => { drag = null; clearOver(); });
document.addEventListener('drop', async e => {
  e.preventDefault(); clearOver(); const d = drag; drag = null;
  if (d && d.t === 'w') { const c = e.target.closest('.col'); if (c) moveWidget(d.id, +c.dataset.col, e.clientY, c); }
  else if (d && d.t === 'i') { const b = e.target.closest('.wb'); if (b) { const r = e.target.closest('[data-iid]'); moveItem(d.id, b.dataset.wid, r && r.dataset.iid); } }
  else if (e.dataTransfer.files.length) {
    const b = e.target.closest('.wb'), paths = [...e.dataTransfer.files].map(f => api.pathOf(f)).filter(Boolean);
    if (tab === 'video' || tab === 'music') return addMedia(tab, paths);
    const wid = b && !['frequent', 'system'].includes(b.dataset.wid) ? b.dataset.wid : '';
    const n = await addPaths(paths, { widget: wid, game: tab === 'games' }); if (n) toast('+' + n);
  }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.cm')) closeMenu();
  const el = e.target.closest('[data-iid]'); if (el) { const it = D.items.find(x => x.id === el.dataset.iid); if (it) launch(it); }
});
document.addEventListener('contextmenu', e => { const el = e.target.closest('[data-iid]'); if (el) { const it = D.items.find(x => x.id === el.dataset.iid); if (it) itemMenu(e, it); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); const o = [...document.querySelectorAll('.ov')].pop(); if (o && o._close) o._close(null); } });

// ---------- collection tabs ----------
function listTab() {
  const tv = D.tv[tab] || (D.tv[tab] = { v: D.s.view, o: D.s.sort });
  const F = { all: () => true, web: i => i.type === 'web', games: i => i.game, folders: i => i.type === 'folder', favs: i => i.fav, recent: i => true, freq: i => i.count > 0 };
  const key = tab === 'apps' ? filt : ({ games: 'games', folders: 'folders', favs: 'favs' })[tab];
  let a = D.items.filter(i => !i.hidden && !isWeb(i) && F[key](i) && (!q || (dn(i) + ' ' + i.path).toLowerCase().includes(q)));
  if (key === 'recent') a = sortItems(a, 'added').slice(0, 40); else if (key === 'freq') a = sortItems(a, 'count'); else a = sortItems(a, tv.o);
  const chips = tab === 'apps' ? ['all', 'web', 'games', 'folders', 'favs', 'recent', 'freq'].map(k => h('button', { class: 'chip' + (filt === k ? ' on' : ''), onclick: () => { filt = k; render(); } }, t({ all: 'f_all', web: 'f_web', games: 'games', folders: 'folders', favs: 'favs', recent: 'f_recent', freq: 'f_freq' }[k]))) : [];
  const s = h('input', { placeholder: t('search'), value: q }); s.oninput = () => { q = s.value.toLowerCase(); const p = $('#lt'); p.replaceChildren(collection(listData(), tv.v)); };
  const listData = () => { let r = D.items.filter(i => !i.hidden && !isWeb(i) && F[key](i) && (!q || (dn(i) + ' ' + i.path).toLowerCase().includes(q))); return key === 'recent' ? sortItems(r, 'added').slice(0, 40) : key === 'freq' ? sortItems(r, 'count') : sortItems(r, tv.o); };
  return h('div', {}, h('div', { class: 'bar2' }, s, chips, sel(VIEWS.map(v => [v, t('v_' + v)]), tv.v, v => { tv.v = v; save(); render(); }), sel(SORTS.map(v => [v, t('o_' + v)]), tv.o, v => { tv.o = v; save(); render(); }), h('button', { class: 'pr', onclick: addDlg }, '＋ ' + t('add'))),
    h('div', { class: 'card', id: 'lt' }, collection(a, tv.v)));
}

// ---------- monitor ----------
const pc = v => v == null ? t('na') : Math.round(v) + '%';
const B = n => { if (n == null) return t('na'); const u = ['B', 'KB', 'MB', 'GB', 'TB']; let i = 0; while (n >= 1024 && i < 4) { n /= 1024; i++; } return n.toFixed(i ? 1 : 0) + ' ' + u[i]; };
const temp = c => c == null ? t('na') : D.s.tf === 'F' ? Math.round(c * 9 / 5 + 32) + '°F' : Math.round(c) + '°C';
const bar = v => h('div', { class: 'bar' }, h('i', { style: `width:${v == null ? 0 : Math.min(100, v)}%` }));
const mcard = (ic, ti, main, sub, ...x) => h('div', { class: 'card mc' }, h('div', {}, ic + ' ' + ti), h('b', {}, main), h('small', {}, sub || ''), x);
function cards() {
  const S = D.s.sensors, m = mon || {}, c = [];
  if (S.cpu) c.push(mcard('💻', t('cpu'), pc(m.cpu), monInfo.cpu || t('na'), bar(m.cpu), h('div', {}, t('temp') + ': ' + temp(m.cpuT))));
  if (S.gpu) { const g = m.gpu || {}; c.push(mcard('🎮', t('gpu'), pc(g.load), monInfo.gpu || t('na'), bar(g.load), h('div', {}, t('temp') + ': ' + temp(g.temp)), h('div', {}, t('vram') + ': ' + (g.vu != null && g.vt ? `${Math.round(g.vu)} / ${Math.round(g.vt)} MB` : t('na'))))); }
  if (S.ram) { const r = m.ram; const p = r ? r.used / r.total * 100 : null; c.push(mcard('🧠', t('ram'), pc(p), r ? `${B(r.used)} / ${B(r.total)} · ${B(r.avail)} ${t('free')}` : t('na'), bar(p))); }
  if (S.disk) { const ds = m.disk || []; c.push(mcard('💾', t('disk'), ds[0] ? pc(ds[0].used / ds[0].size * 100) : t('na'), `${t('readwrite')}: ${m.io ? B(m.io.r) + '/s · ' + B(m.io.w) + '/s' : t('na')}`, ds.map(d => h('div', {}, `${d.mount} — ${B(d.size - d.used)} ${t('free')} / ${B(d.size)}`, bar(d.used / d.size * 100))))); }
  if (S.net) c.push(mcard('🌐', t('net'), m.net ? '↓ ' + B(m.net.d) + '/s' : t('na'), m.net ? '↑ ' + B(m.net.u) + '/s' : ''));
  return c;
}
function paintMon() {
  if (document.hidden) return;
  const S = D.s.sensors, m = mon || {}, ch = $('#chips');
  if (ch) { const a = []; if (S.cpu) a.push(`CPU ${pc(m.cpu)}`); if (S.gpu) a.push(`GPU ${pc(m.gpu && m.gpu.load)}`); if (S.ram) a.push(`RAM ${pc(m.ram ? m.ram.used / m.ram.total * 100 : null)}`); if (S.net) a.push(m.net ? `↓${B(m.net.d)}/s` : 'NET ' + t('na')); ch.replaceChildren(...a.map(x => h('span', {}, x))); }
  const p = $('#mpanel'); if (p) p.replaceChildren(...cards());
  const g = $('#mtab'); if (g) g.replaceChildren(...cards());
}

// ---------- settings ----------
const row = (l, c) => h('div', { class: 'srow' }, h('label', {}, l), c);
const chk = (v, on) => h('input', { type: 'checkbox', checked: v, onchange: e => on(e.target.checked) });
function settings() {
  const S = D.s, set = (k, v, r = true) => { S[k] = v; save(); if (r) render(); };
  const sec = (ti, ...r) => h('section', { class: 'card' }, h('h3', {}, ti), r);
  return h('div', { class: 'set' },
    sec(t('g_general'), row(t('language'), sel([['en', 'English'], ['fa', 'فارسی'], ['ar', 'العربية']], S.lang, v => set('lang', v))),
      row(t('theme'), sel([['system', t('th_system')], ['dark', t('th_dark')], ['light', t('th_light')]], S.theme, v => set('theme', v))),
      row(t('tray'), chk(S.tray, v => { set('tray', v, false); api.prefs(S); })), row(t('autostart'), chk(S.autostart, v => { set('autostart', v, false); api.prefs(S); })), row(t('s_eco'), sel([['auto', t('eco_auto')], ['on', t('eco_on')], ['off', t('eco_off')]], S.eco, v => { set('eco', v, false); applyEco(); }))),
    sec(t('home'), row(t('cols'), colBtns()), row(t('defview'), sel(VIEWS.map(v => [v, t('v_' + v)]), S.view, v => set('view', v, false))),
      ...D.widgets.map(w => row(wt(w), chk(!w.hidden, v => { w.hidden = !v; save(); }))), row('', h('button', { onclick: resetLayout }, t('resetlayout')))),
    sec(t('monitor'), row(t('interval'), sel([2, 3, 5, 10, 30].map(n => [String(n), String(n)]), String(S.interval), v => { set('interval', +v, false); api.monCfg(+v * 1000, D.s.sensors); })),
      row(t('tunit'), sel([['C', '°C'], ['F', '°F']], S.tf, v => set('tf', v))),
      row(t('sensors'), h('div', { class: 'row' }, ['cpu', 'gpu', 'ram', 'disk', 'net'].map(k => h('label', {}, chk(S.sensors[k], v => { S.sensors[k] = v ? 1 : 0; save(); api.monCfg(S.interval * 1000, S.sensors); paintMon(); }), ' ' + t(k)))))),
    sec(t('apps'), row(t('dupes'), chk(S.dupes, v => set('dupes', v, false))), row(t('s_pcin'), sel([['workspace', t('s_wsp')], ['windows', t('s_winx')]], S.pcIn, v => set('pcIn', v, false))), row(t('s_webopen'), sel([['builtin', t('s_inbr')], ['system', t('s_sysbr')]], S.webOpen, v => set('webOpen', v, false))), row(t('defsort'), sel(SORTS.map(v => [v, t('o_' + v)]), S.sort, v => set('sort', v, false)))),
    gsyncSec(), defAppsSec(),
    sec(t('data'), h('div', { class: 'row' },
      h('button', { onclick: async () => { if (await api.jsonSave(D)) toast(t('done')); } }, t('backup')),
      h('button', { onclick: async () => { const o = await api.jsonOpen(); if (!o) return; if (o.__error || !Array.isArray(o.items)) return toast(t('invalid')); applyLoaded(o); save(); api.prefs(D.s); api.monCfg(D.s.interval * 1000, D.s.sensors); render(); } }, t('restore')),
      h('button', { onclick: async () => { const o = await api.jsonOpen(); if (!o || o.__error) return o && toast(t('invalid')); let n = 0; for (const [k, v] of Object.entries(o)) if (typeof v === 'string') n += await addPaths([v], { name: k }); toast('+' + n); } }, t('imp')),
      h('button', { onclick: async () => { if (await yes(t('reset') + '?')) { D = DEF(); seed(); save(); render(); } } }, t('reset')))));
}
async function clockDlg() {
  const zones = (Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : []), cur = D.s.lang;
  const lc = chk(D.s.local, v => { D.s.local = v; save(); tickClock(); });
  const z = sel(zones.map(x => [x, x]), D.s.tzl[cur], v => { D.s.tzl[cur] = v; save(); tickClock(); });
  await modal(t('tz'), h('div', { class: 'frm' }, h('small', {}, t('clocknote2')), h('label', {}, t('tzfor') + ': '), z, h('label', {}, lc, ' ' + t('tzlocal')), h('button', { onclick: () => api.openDate() }, t('opendate'))), [[t('done'), true, 'pr']]);
}
function tickClock() {
  const e = $('#clk'); if (!e || document.hidden) return; const z = tzv(), d = new Date();
  e.replaceChildren(h('b', {}, fmtc({ timeStyle: 'medium' }, z).format(d)), h('span', {}, fmtc({ dateStyle: 'full' }, z).format(d) + (z ? ' · ' + z : '')));
}

// ---------- media players (video + music) ----------
const MEXT = { video: ['.mp4', '.mkv', '.webm', '.avi', '.mov', '.m4v', '.wmv', '.ts', '.mpg', '.mpeg'], music: ['.mp3', '.flac', '.wav', '.ogg', '.m4a', '.aac', '.opus', '.wma'] };
const MP = { video: { el: null, pend: null, subs: [], sub: -1, msg: '' }, music: { el: null, pend: null } };
const mkey = p => p.toLowerCase(), bn = p => p.split(/[\\/]/).pop();
const fmtT = s => { s = isFinite(s) ? Math.max(0, Math.floor(s)) : 0; const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
const fileUrl = p => 'file:///' + encodeURI(p.replace(/\\/g, '/')).replace(/[#?]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const svg = (d, st) => `<svg viewBox="0 0 24 24" width="22" height="22" ${st ? 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' : 'fill="currentColor"'}><path d="${d}"/></svg>`;
const ICO = { play: svg('M8 5v14l11-7z'), pause: svg('M6 5h4v14H6zM14 5h4v14h-4z'), prev: svg('M6 6h2v12H6zM9.5 12L18 6v12z'), next: svg('M16 6h2v12h-2zM6 6l8.5 6L6 18z'),
  back: svg('M3 12a9 9 0 109-9M3 4v5h5', 1), fwd: svg('M21 12a9 9 0 11-9-9M21 4v5h-5', 1), vol: svg('M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11', 1),
  fs: svg('M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5', 1), shuf: svg('M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3', 1), rep: svg('M4 11V9a3 3 0 013-3h11M15 3l3 3-3 3M20 13v2a3 3 0 01-3 3H6M9 21l-3-3 3-3', 1), cc: svg('M4 5h16v12H8l-4 3zM8 10h8M8 13h5', 1),
  mute: svg('M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6', 1), pip: svg('M3 5h18v14H3zM12 12h7v5h-7z', 1), moon: svg('M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z', 1),
  scene: svg('M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6', 1), style: svg('M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2.2-.5-1.2.3-2.3 1.7-2.3H18a3 3 0 003-3A9 9 0 0012 3z', 1) };
const ib = (html, fn, cls, id, title) => h('button', { class: 'rb ' + (cls || ''), id, title, onclick: fn, html });
function parseVtt(txt) {
  const out = [];
  for (const b of String(txt).replace(/\r/g, '').split(/\n\n+/)) {
    const L = b.split('\n'), k = L.findIndex(l => l.includes('-->')); if (k < 0) continue;
    const m = L[k].match(/(?:(\d+):)?(\d+):(\d+)[.,](\d+)\s*-->\s*(?:(\d+):)?(\d+):(\d+)[.,](\d+)/); if (!m) continue;
    const T = (a, b2, c, d) => (+a || 0) * 3600 + +b2 * 60 + +c + +('0.' + d);
    out.push({ s: T(m[1], m[2], m[3], m[4]), e: T(m[5], m[6], m[7], m[8]), x: L.slice(k + 1).join('\n').replace(/\{\\[^}]*\}/g, '') });
  }
  return out;
}
function savePos(k) {
  const S = MP[k], M = D.media[k], el = S.el; if (!el || S.pend || M.i < 0) return;
  const p = M.list[M.i], d = el.duration, c = el.currentTime; if (!p || !isFinite(d) || !d) return;
  if (el.ended || c < 5 || d - c < 10) delete D.media.pos[mkey(p)]; else D.media.pos[mkey(p)] = { t: c, d, at: Date.now() };
  const ks = Object.keys(D.media.pos); if (ks.length > 500) ks.sort((a, b) => D.media.pos[a].at - D.media.pos[b].at).slice(0, ks.length - 500).forEach(x => delete D.media.pos[x]);
  save();
}
function stopEl(k) { const S = MP[k]; if (S.el) { try { S.el.pause(); S.el.removeAttribute('src'); S.el.load(); S.el.remove(); } catch {} } S.el = null; }
const toggleFs = () => { const w = $('#vw'); if (document.fullscreenElement) document.exitFullscreen(); else if (w) w.requestFullscreen(); };
function updUI(k) {
  const S = MP[k], el = S.el, g = x => $('#' + k + '-' + x), sk = g('seek'); if (!sk) return;
  const d = el && isFinite(el.duration) ? el.duration : 0, c = el ? el.currentTime : 0;
  let b = 0; try { if (el && el.buffered.length) b = el.buffered.end(el.buffered.length - 1); } catch {}
  if (!S.seeking) { sk.max = d; sk.value = c; sk.style.setProperty('--p', (d ? c / d * 100 : 0) + '%'); }
  sk.style.setProperty('--b', (d ? b / d * 100 : 0) + '%');
  g('cur').textContent = fmtT(c); g('tot').textContent = fmtT(d); g('left').textContent = '⏳ ' + fmtT(d - c) + ' ' + t('m_left');
  const pb = g('play'); if (pb) pb.innerHTML = el && !el.paused ? ICO.pause : ICO.play;
  const mb = g('mute'); if (mb) mb.innerHTML = el && (el.muted || el.volume === 0) ? ICO.mute : ICO.vol;
  const rg = g('ring'); if (rg) { const C = 2 * Math.PI * 36; rg.style.strokeDasharray = C; rg.style.strokeDashoffset = C * (1 - (d ? c / d : 0)); }
  const en = g('end'); if (en) en.textContent = d && el && !el.paused ? '🕒 ' + t('m_end') + ' ' + fmtc({ timeStyle: 'short' }, tzv()).format(Date.now() + (d - c) / (el.playbackRate || 1) * 1000) : '';
  const sp = g('spd'); if (sp) sp.textContent = (S.rate || 1) + '×';
}
function playIdx(k, i) {
  const M = D.media[k], S = MP[k]; savePos(k); stopEl(k); S.pend = null; S.err = null; S.subs = []; S.sub = -1; S.msg = '';
  if (i < 0 || i >= M.list.length) { M.i = -1; save(); if (tab === k) render(); return; }
  M.i = i; const p = M.list[i]; save();
  const el = document.createElement(k === 'video' ? 'video' : 'audio'); el.preload = 'auto';
  el.volume = S.vol == null ? 1 : S.vol; el.playbackRate = S.rate || 1; S.el = el;
  const pos = D.media.pos[mkey(p)]; if (pos && pos.t >= 5 && pos.d - pos.t >= 10) S.pend = pos;   // notice shown; playback starts from 0 until the user chooses
  const on = (ev, f) => el.addEventListener(ev, () => { if (S.el === el) f(); });
  on('timeupdate', () => { const n = Date.now(); if (n - (S.ts || 0) > 5000) { S.ts = n; savePos(k); } updUI(k); });
  on('pause', () => { savePos(k); updUI(k); }); on('play', () => updUI(k)); on('durationchange', () => updUI(k)); on('ratechange', () => { S.rate = el.playbackRate; updUI(k); });
  on('volumechange', () => { S.vol = el.volume; updUI(k); });
  on('error', () => { S.err = p; if (tab === k) render(); });
  on('ended', () => {
    savePos(k); if (S.rep === 'one') { el.currentTime = 0; el.play(); return; }
    let n = M.i + 1; if (S.shuf && M.list.length > 1) { do n = Math.floor(Math.random() * M.list.length); while (n === M.i); }
    if (n < M.list.length) playIdx(k, n); else if (S.rep === 'all') playIdx(k, 0); else { updUI(k); }
  });
  if (k === 'video') { el.addEventListener('click', () => { if (el.paused) el.play(); else el.pause(); }); el.addEventListener('dblclick', toggleFs); }
  el.src = fileUrl(p); el.play().catch(() => {});
  if (k === 'video') loadSubs(k, p, el);
  if (tab === k) render();
}
function addSub(S, x) {
  const cues = parseVtt(x.vtt || ''); if (!cues.length) return;
  const tt = S.el.addTextTrack('subtitles', x.label, x.lang || 'und'); tt.mode = 'disabled';
  for (const c of cues) { try { tt.addCue(new VTTCue(c.s, c.e, c.x)); } catch {} }
  S.subs.push({ label: x.label, lang: x.lang, tt });
}
const setSub = (S, j) => { S.sub = j; S.subs.forEach((s, i) => { s.tt.mode = i === j ? 'showing' : 'disabled'; }); };
const subBox = () => [MP.video.msg ? h('small', {}, MP.video.msg) : null];
const paintSubs = () => { const b = $('#subbox'); if (b) b.replaceChildren(...subBox().filter(Boolean)); };
async function loadSubs(k, p, el) {
  const S = MP[k]; S.msg = t('sub_busy'); paintSubs();
  let r; try { r = await api.subs(p); } catch { r = { tracks: [] }; }
  if (S.el !== el) return;
  r.tracks.forEach(x => addSub(S, x));
  const w = ({ fa: ['fa', 'per', 'fas'], ar: ['ar', 'ara'], en: ['en', 'eng'] })[D.s.lang];
  const j = S.subs.findIndex(s => { const l = (s.lang || '').toLowerCase(); return w.includes(l) || w.includes(l.slice(0, 2)) || w.includes(l.slice(0, 3)); });
  if (j >= 0) setSub(S, j);
  S.msg = S.subs.length ? (r.skipped ? t('sub_img') : '') : ((!r.ffmpeg ? t('sub_noff') : t('sub_none')) + (r.skipped ? ' — ' + t('sub_img') : ''));
  paintSubs(); if (S.subs.length) toast('CC × ' + S.subs.length);
}
async function loadSubFile() {
  const S = MP.video, f = await api.pick('sub'); if (!f || !S.el) return;
  for (const p of f) { const x = await api.subFile(p); if (x && x.vtt) { const n = S.subs.length; addSub(S, x); if (S.subs.length > n) setSub(S, S.subs.length - 1); } }
  paintSubs();
}
function noticeEl(k) {
  const S = MP[k]; if (!S.pend) return null; const pd = S.pend;
  const go = ts => { S.pend = null; if (S.el) { S.el.currentTime = ts; S.el.play().catch(() => {}); } paintNotice(k); };
  return h('div', { class: 'mnotice' }, h('span', {}, t('resume_q')), h('button', { class: 'pr', onclick: () => go(pd.t) }, '▶ ' + t('resume_cont') + ' (' + fmtT(pd.t) + ')'),
    h('button', { onclick: () => go(0) }, '⏮ ' + t('resume_start')), h('button', { title: '✕', onclick: () => { S.pend = null; paintNotice(k); } }, '✕'));
}
const paintNotice = k => { const c = $('#n-' + k); if (c) { const n = noticeEl(k); c.replaceChildren(...(n ? [n] : [])); } };
async function addMedia(k, paths) {
  const M = D.media[k], have = new Set(M.list.map(mkey)); let n = 0;
  for (const p0 of paths) {
    const i = await api.info(p0); if (!i.kind || i.kind === 'url' || i.kind === 'cmd') continue;
    const files = i.kind === 'folder' ? await api.scan(i.path, k) : [i.path];
    for (const f of files) { if (!MEXT[k].includes(('.' + f.split('.').pop()).toLowerCase()) || have.has(mkey(f))) continue; have.add(mkey(f)); M.list.push(f); n++; }
  }
  if (!n) { toast(t('invalid')); return; }
  save(); if (!MP[k].el) playIdx(k, M.list.length - n); else if (tab === k) render();
}
function removeAt(k, i) {
  const M = D.media[k]; if (i === M.i) { savePos(k); stopEl(k); MP[k].pend = null; M.i = -1; } else if (i < M.i) M.i--;
  M.list.splice(i, 1); save(); render();
}
function popMenu(e, A) {
  e.stopPropagation(); closeMenu(); const m = h('div', { class: 'cm' }, A.map(([l, f]) => h('div', { onclick: () => { closeMenu(); f(); } }, l)));
  document.body.append(m);
  let x, y; if (e.type === 'contextmenu') { x = e.clientX; y = e.clientY; } else { const r = e.currentTarget.getBoundingClientRect(); x = r.left; y = r.bottom + 4; }
  m.style.left = Math.max(6, Math.min(x, innerWidth - m.offsetWidth - 6)) + 'px'; m.style.top = Math.max(6, Math.min(y, innerHeight - m.offsetHeight - 6)) + 'px';
}
const SLEEP = { t: 0 };
function setSleep(m) { clearTimeout(SLEEP.t); if (m) { SLEEP.t = setTimeout(() => { ['music', 'video'].forEach(k => { if (MP[k].el) MP[k].el.pause(); }); toast('🌙'); }, m * 60000); toast('🌙 ' + m + ' min'); } else toast('🌙 ✕'); }
function scenePicker() {
  return modal(t('fx_l'), close => {
    const q = h('input', { placeholder: t('search') }), grid = h('div', { class: 'scg' });
    const pick = i => { D.s.fx = i; save(); close(null); render(); };
    const draw = () => {
      const f = q.value.trim().toLowerCase(), out = [];
      const put = (i, label) => { if (!f || label.toLowerCase().includes(f)) out.push(h('button', { class: 'sc' + (D.s.fx === i ? ' on' : ''), onclick: () => pick(i) }, label)); };
      put(-2, t('fx_auto')); put(-1, t('fx_off'));
      for (let i = 0; i < SENFX.count; i++) put(i, fxName(i));
      grid.replaceChildren(...out);
    };
    q.oninput = draw; draw();
    return h('div', { class: 'frm' }, q, grid);
  }, [[t('cancel'), null]]);
}
function ctlBar(k) {
  const S = MP[k], M = D.media[k], id = x => k + '-' + x;
  const step = d => () => { if (M.list.length) playIdx(k, (Math.max(M.i, 0) + d + M.list.length) % M.list.length); };
  const skip = s => () => { if (S.el) S.el.currentTime = Math.max(0, Math.min(S.el.duration || 1e9, S.el.currentTime + s)); };
  const seek = h('input', { id: id('seek'), class: 'seek', type: 'range', min: 0, max: 0, step: 'any', value: 0,
    oninput: e => { S.seeking = true; $('#' + id('cur')).textContent = fmtT(e.target.value); e.target.style.setProperty('--p', (+e.target.max ? e.target.value / e.target.max * 100 : 0) + '%'); },
    onchange: e => { if (S.el) S.el.currentTime = +e.target.value; S.seeking = false; } });
  const tip = h('span', { class: 'tip' }), sw = h('div', { class: 'seekw' }, seek, tip);
  seek.addEventListener('mousemove', e => { const r = seek.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); tip.textContent = fmtT(f * (S.el && isFinite(S.el.duration) ? S.el.duration : 0)); tip.style.left = (f * 100) + '%'; });
  const vol = h('input', { class: 'seek vol', type: 'range', min: 0, max: 1, step: 0.02, value: S.vol == null ? 1 : S.vol, oninput: e => { S.vol = +e.target.value; if (S.el) { S.el.volume = S.vol; S.el.muted = false; } e.target.style.setProperty('--p', S.vol * 100 + '%'); } });
  vol.style.setProperty('--p', (S.vol == null ? 1 : S.vol) * 100 + '%');
  const toggle = () => { if (!S.el) { if (M.list.length) playIdx(k, Math.max(M.i, 0)); } else if (S.el.paused) S.el.play(); else S.el.pause(); };
  const speedMenu = e => popMenu(e, [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(x => [((S.rate || 1) === x ? '● ' : '○ ') + x + '×', () => { S.rate = x; if (S.el) S.el.playbackRate = x; updUI(k); }]));
  const subMenu = e => popMenu(e, [[(S.sub < 0 ? '● ' : '○ ') + t('sub_off'), () => setSub(S, -1)], ...S.subs.map((x, i) => [(S.sub === i ? '● ' : '○ ') + x.label, () => setSub(S, i)]), [t('sub_load'), loadSubFile], ...(S.msg ? [['ⓘ ' + S.msg, () => {}]] : [])]);
  const sleepMenu = e => popMenu(e, [['✕', () => setSleep(0)], ...[15, 30, 45, 60, 90].map(m => [m + ' min', () => setSleep(m)])]);
  const mute = () => { if (S.el) { S.el.muted = !S.el.muted; updUI(k); } };
  const pip = () => { if (S.el && S.el.requestPictureInPicture) S.el.requestPictureInPicture().catch(() => {}); };
  const repBtn = () => ib(ICO.rep, () => { S.rep = !S.rep ? 'all' : S.rep === 'all' ? 'one' : ''; render(); }, S.rep ? 'on' : '', null, S.rep === 'one' ? t('rep_one') : S.rep === 'all' ? t('rep_all') : t('rep_off'));
  const cur = h('span', { id: id('cur'), class: 'tm' }, '0:00'), tot = h('span', { id: id('tot'), class: 'tm' }, '0:00');
  const left = h('span', { id: id('left'), class: 'pill' }), end = h('span', { id: id('end'), class: 'pill' });
  const spd = h('button', { class: 'pillb', id: id('spd'), onclick: speedMenu }, (S.rate || 1) + '×');
  const fsId = k === 'video' ? 'vw' : 'ap';
  if (k === 'video') {
    return h('div', { class: 'ctl vc' }, sw,
      h('div', { class: 'brow' }, h('div', { class: 'grp' }, ib(ICO.prev, step(-1), '', null, 'Prev'), ib(ICO.play, toggle, 'big', id('play'), 'Space'), ib(ICO.next, step(1), '', null, 'Next'), ib(ICO.back, skip(-10), '', null, '-10s'), ib(ICO.fwd, skip(10), '', null, '+10s')),
        h('div', { class: 'grp volw' }, ib(ICO.vol, mute, '', id('mute')), vol), h('span', { class: 'tmx' }, cur, ' / ', tot), h('span', { class: 'sp' }), left, end,
        h('div', { class: 'grp' }, ib(ICO.cc, subMenu, S.subs.length ? 'on' : '', null, t('sub_l')), spd, ib(ICO.pip, pip, '', null, 'PiP'), repBtn(), ib(ICO.moon, sleepMenu), ib(ICO.fs, () => toggleFsEl(fsId), '', null, 'F'))));
  }
  const style = D.s.mstyle || 'ring', fsB = ib(ICO.fs, () => toggleFsEl(fsId), '', null, 'F'), moonB = ib(ICO.moon, sleepMenu, '', null, 'Sleep'), playB = ib(ICO.play, toggle, 'big', id('play'), 'Space');
  const shufB = ib(ICO.shuf, () => { S.shuf = !S.shuf; render(); }, S.shuf ? 'on' : '', null, t('shuf'));
  const sceneBtn = ib(ICO.scene, () => scenePicker(), '', null, t('fx_l'));
  // const pick = i => () => { D.s.fx = i; save(); render(); };
  // const sceneBtn = ib(ICO.scene, e => popMenu(e, [[(D.s.fx === -2 ? '● ' : '○ ') + t('fx_auto'), pick(-2)], [(D.s.fx === -1 ? '● ' : '○ ') + t('fx_off'), pick(-1)], ...Array.from({ length: SENFX.count }, (_, i) => [(D.s.fx === i ? '● ' : '○ ') + fxName(i), pick(i)])]), '', null, t('fx_l'));
  const styleBtn = ib(ICO.style, e => popMenu(e, ['ring', 'neon', 'bar', 'pill', 'minimal'].map(x => [(style === x ? '● ' : '○ ') + t('ms_' + x), () => { D.s.mstyle = x; save(); render(); }])), '', null, t('ms_l'));
  if (style === 'bar' || style === 'pill' || style === 'minimal') {
    return h('div', { class: 'ctl mc row1 ' + style }, h('div', { class: 'grp' }, ib(ICO.prev, step(-1)), playB, ib(ICO.next, step(1))), cur, sw, tot,
      h('div', { class: 'grp volw' }, ib(ICO.vol, mute, '', id('mute')), vol), h('div', { class: 'grp' }, shufB, repBtn(), spd, moonB, sceneBtn, styleBtn, fsB), left, end);
  }
  const ring = h('div', { class: 'playw', html: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="36" class="rt"/><circle cx="40" cy="40" r="36" class="rf" id="${id('ring')}"/></svg>` });
  ring.append(playB);
  return h('div', { class: 'ctl mc ' + style }, h('div', { class: 'trow' }, cur, sw, tot), h('div', { class: 'trow2' }, left, end),
    h('div', { class: 'mrow' }, h('div', { class: 'grp' }, ib(ICO.vol, mute, '', id('mute')), vol),
      h('div', { class: 'grp cen' }, shufB, ib(ICO.prev, step(-1)), ib(ICO.back, skip(-10)), ring, ib(ICO.fwd, skip(10)), ib(ICO.next, step(1)), repBtn()),
      h('div', { class: 'grp' }, spd, moonB, sceneBtn, styleBtn, fsB)));
}
function toggleFsEl(id) { const w = document.getElementById(id); if (document.fullscreenElement) document.exitFullscreen(); else if (w) w.requestFullscreen(); }
function autoHide(el) {
  let t0 = 0;
  const wake = () => { el.classList.remove('idle'); clearTimeout(t0); if (document.fullscreenElement === el) t0 = setTimeout(() => { const m = el.id === 'vw' ? MP.video.el : MP.music.el; if (m && !m.paused) el.classList.add('idle'); }, 2500); };
  ['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(ev => el.addEventListener(ev, wake)); el.addEventListener('fullscreenchange', wake);
}
let FXSTOP = null;
const fxName = i => { const m = SENFX.meta[i], k = 'fxn_' + m.k; return T[k] ? t(k) : (m.name || m.k); };
const dirOf = p => p.replace(/[\\/][^\\/]*$/, '');
function removeGroup(k, d) { const M = D.media[k], cur = M.i >= 0 ? M.list[M.i] : null; savePos(k); M.list = M.list.filter(p => dirOf(p) !== d); if (cur && !M.list.includes(cur)) { stopEl(k); MP[k].pend = null; M.i = -1; } else M.i = cur ? M.list.indexOf(cur) : -1; save(); render(); }
function plView(k) {
  const S = MP[k], M = D.media[k]; S.col = S.col || new Set();
  if (!M.list.length) return [h('div', { class: 'empty' }, t('mp_empty'))];
  const groups = [], idx = new Map();
  M.list.forEach((p, i) => { const d = dirOf(p); if (!idx.has(d)) { const g = { d, items: [] }; idx.set(d, g); groups.push(g); } idx.get(d).items.push([p, i]); });
  const parts = groups.map(g => g.d.split(/[\\/]/)); let cp = 0;
  if (groups.length === 1) cp = parts[0].length - 1; else while (parts.every(x => x.length > cp + 1 && x[cp] === parts[0][cp])) cp++;
  const out = [];
  groups.forEach((g, gi) => {
    const label = parts[gi].slice(cp).join(' / ') || g.d, closed = S.col.has(g.d), tg = () => { if (closed) S.col.delete(g.d); else S.col.add(g.d); render(); };
    out.push(h('div', { class: 'pg' }, h('span', { class: 'ar', onclick: tg }, closed ? '▸' : '▾'), h('span', { class: 'nm', onclick: tg, title: g.d }, '📁 ' + label), h('small', {}, String(g.items.length)),
      h('button', { title: '▶', onclick: () => playIdx(k, g.items[0][1]) }, '▶'), h('button', { title: '✕', onclick: () => removeGroup(k, g.d) }, '✕')));
    if (!closed) g.items.forEach(([p, i]) => out.push(h('div', { class: 'pi sub' + (i === M.i ? ' on' : ''), onclick: () => playIdx(k, i) }, h('span', { class: 'nm' }, (i === M.i ? '▶ ' : '') + bn(p)), h('button', { onclick: e => { e.stopPropagation(); removeAt(k, i); } }, '✕'))));
  });
  return out;
}
const FXMAP = [[/rain|lofi|chill|study|jazz|coffee|piano|sad|slow|باران|غم|تنهایی/i, 'lofi'], [/night|city|neon|club|dance|disco|remix|شب|شهر/i, 'skyline'], [/synth|retro|80s|drive|wave/i, 'synth'], [/space|star|cosmic|orbit|moon|universe|ستاره|فضا|ماه/i, 'galaxy'], [/solar|planet/i, 'solar'], [/fly|sky|cloud|wing|plane|air|travel|آسمان|پرواز/i, 'plane'], [/snow|winter|north|aurora|ice|cold|برف|زمستان/i, 'aurora'], [/sea|ocean|beach|summer|sunset|دریا|ساحل|غروب/i, 'ocean'], [/bass|drop|edm|rave|hip|rap|trap|beat|electro|techno/i, 'eq'], [/love|romantic|spring|flower|sakura|rose|heart|عشق|دل|بهار|گل/i, 'sakura'], [/dream|psyche|trip|lava|fire/i, 'lava'], [/code|hack|matrix|cyber|digital|robot/i, 'matrix'], [/forest|fairy|magic|firefly|nature|folk|acoustic|جنگل|طبیعت/i, 'fireflies'], [/deep|dive|blue|whale|water|عمق/i, 'deep'], [/speed|fast|warp|race|run|power|rock|metal/i, 'warp']];
function autoFx(p) {
  const name = (p || '').split(/[\\/]/).slice(-3).join(' ');
  for (const [re, k] of FXMAP) if (re.test(name)) return SENFX.meta.findIndex(m => m.k === k);
  let hh = 0; for (const ch of name) hh = (hh * 31 + ch.charCodeAt(0)) >>> 0; return hh % SENFX.count;
}
function mediaView(k) {
  const S = MP[k], M = D.media[k], cur = M.i >= 0 ? M.list[M.i] : null;
  const pl = h('div', { class: 'pl card' }, plView(k));
  const top = h('div', { class: 'bar2' },
    h('button', { class: 'pr', onclick: async () => { const f = await api.pick(k === 'video' ? 'video' : 'audio'); if (f) addMedia(k, f); } }, '＋ ' + t('mp_files')),
    h('button', { onclick: async () => { const f = await api.pick('folder'); if (f) addMedia(k, f); } }, t('mp_folder')),
    h('button', { onclick: () => { savePos(k); stopEl(k); S.pend = null; M.list = []; M.i = -1; save(); render(); } }, t('mp_clear')));
  const err = S.err ? h('div', { class: 'card' }, t('nofmt') + ' ', h('button', { onclick: () => api.launch({ type: 'app', id: '', path: S.err }) }, t('opendef'))) : null;
  let player;
  if (k === 'video') {
    const vw = h('div', { class: 'vw', id: 'vw' }, S.el || h('div', { class: 'vph' }, '🎬'), h('div', { id: 'n-video', class: 'nv' }, noticeEl('video') || ''), ctlBar('video'));
    autoHide(vw); player = h('div', {}, vw, err);
  } else {
    const fxi = D.s.fx === -2 ? autoFx(cur) : D.s.fx, cv = h('canvas', { class: 'fxc' });
    if (FXSTOP) FXSTOP(); FXSTOP = fxi >= 0 ? SENFX.create(cv, fxi, () => !!(MP.music.el && !MP.music.el.paused)) : null;
    const ap = h('div', { class: 'card ap', id: 'ap' }, h('div', { class: 'fxw' }, fxi >= 0 ? cv : h('div', { class: 'big' }, '🎵'), h('div', { class: 'fxt' }, cur ? bn(cur) : '—')),
      h('div', { id: 'n-music', class: 'nv' }, noticeEl('music') || ''), err, ctlBar('music'));
    autoHide(ap); player = ap;
  }
  setTimeout(() => { updUI(k); const a = $('.pi.on'); if (a) a.scrollIntoView({ block: 'nearest' }); }, 0);
  return h('div', {}, top, h('div', { class: 'mw' }, player, pl));
}
addEventListener('beforeunload', () => { savePos('video'); savePos('music'); api.save(D); });
document.addEventListener('keydown', e => {
  if (tab !== 'video' && tab !== 'music') return;
  const tg = e.target; if (tg.tagName === 'SELECT' || (tg.tagName === 'INPUT' && ['text', 'search'].includes(tg.type)) || document.querySelector('.ov')) return;
  const S = MP[tab], el = S.el; if (!el) return;
  if (e.key === ' ') { e.preventDefault(); if (el.paused) el.play(); else el.pause(); }
  else if (e.key === 'ArrowRight') el.currentTime += 5; else if (e.key === 'ArrowLeft') el.currentTime -= 5;
  else if (e.key.toLowerCase() === 'f' && tab === 'video') toggleFs(); else if (e.key.toLowerCase() === 'm') el.muted = !el.muted;
});

// ---------- workspace: tabs (web pages + built-in file explorer) in 1 or 2 panes, with browser features ----------
const bhost = h('div', { id: 'bhost' }); document.body.append(bhost);
const BR = { tabs: [], cur: [-1, -1], ap: 0, n: 0, find: false, blk: 0, init: 0, media: [], dd: -1, closed: [], hq: '' };
const ENG = { google: 'https://www.google.com/search?q=', ddg: 'https://duckduckgo.com/?q=', bing: 'https://www.bing.com/search?q=', brave: 'https://search.brave.com/search?q=' };
const DIAL = [['Google', 'https://www.google.com'], ['YouTube', 'https://www.youtube.com'], ['Wikipedia', 'https://www.wikipedia.org'], ['GitHub', 'https://github.com'], ['Reddit', 'https://www.reddit.com'], ['X', 'https://x.com'], ['Telegram', 'https://web.telegram.org'], ['Gmail', 'https://mail.google.com']];
const CONT = [['personal', '#4a8cff'], ['work', '#ff9f43'], ['shopping', '#2ecc71'], ['banking', '#ff5c5c']];
const hostOf = u => { try { return new URL(u).hostname; } catch { return ''; } };
const toUrl = s => {
  s = s.trim(); if (!s) return '';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s) || /^view-source:/i.test(s)) return s;
  if (!/\s/.test(s) && /^(localhost|[\w-]+(\.[\w-]+)+)(:\d+)?([/?#].*)?$/i.test(s)) return 'https://' + s;
  return (ENG[D.b.engine] || ENG.google) + encodeURIComponent(s);
};
const bcur = () => BR.tabs[BR.cur[BR.ap]];
const partOf = c => c.priv ? 'sen-private' : c.ct ? 'persist:sen-ct-' + c.ct : 'persist:sen-web';
const mobileUA = () => 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) ' + ((boot.ua || '').match(/Chrome\/[\d.]+/) || ['Chrome/130.0.0.0'])[0] + ' Mobile Safari/537.36';
const DARKCSS = 'html{filter:invert(1) hue-rotate(180deg)!important}img,video,canvas,picture{filter:invert(1) hue-rotate(180deg)!important}';
const READER = `(function(){const a=document.querySelector('article')||document.querySelector('main')||document.body;const ps=[...a.querySelectorAll('h1,h2,h3,p,li,blockquote,img')].filter(e=>e.tagName==='IMG'?e.width>200:/^H/.test(e.tagName)||e.textContent.trim().length>30);const t=document.title;document.body.innerHTML='';document.body.style.cssText='max-width:720px;margin:40px auto;padding:0 20px;font:19px/1.8 Georgia,serif;background:#faf8f3;color:#222';const h=document.createElement('h1');h.textContent=t;document.body.append(h);ps.forEach(e=>{const c=e.cloneNode(true);if(c.tagName==='IMG')c.style.maxWidth='100%';document.body.append(c)})})()`;
const ALOUD = `(function(){if(speechSynthesis.speaking){speechSynthesis.cancel();return}const t=(getSelection().toString()||(document.querySelector('article')||document.body).innerText).slice(0,9000);const u=new SpeechSynthesisUtterance(t);speechSynthesis.speak(u)})()`;
const PIPJS = `(function(){const v=[...document.querySelectorAll('video')].sort((a,b)=>b.clientWidth*b.clientHeight-a.clientWidth*a.clientHeight)[0];if(v)v.requestPictureInPicture()})()`;
function histAdd(c) {
  if (c.priv || !/^https?:/.test(c.url)) return; const H = D.b.hist;
  if (H[0] && H[0].url === c.url) return; H.unshift({ url: c.url, title: c.title || hostOf(c.url), at: Date.now() }); if (H.length > 1000) H.length = 1000; save();
}
function syncSess() { D.b.sess = BR.tabs.filter(x => !x.priv && (x.url || x.kind === 'fs')).map(x => ({ k: x.kind, u: x.url, path: x.fs.path, pin: x.pin, ct: x.ct, pane: x.pane })).slice(0, 14); save(); }
function fixCur() {
  for (const p of [0, 1]) { const c = BR.tabs[BR.cur[p]]; if (!c || c.pane !== p) { let k = -1; BR.tabs.forEach((x, i) => { if (x.pane === p) k = i; }); BR.cur[p] = k; } }
  if (!BR.tabs.some(x => x.pane === BR.ap)) BR.ap = BR.ap ? 0 : 1;
}
function mkWv(c) {
  if (c.wv || c.mk) return; c.mk = true;
  api.brPart(partOf(c)).then(() => {
    c.mk = false; if (!BR.tabs.includes(c)) return;
    const wv = document.createElement('webview');
    wv.setAttribute('partition', partOf(c)); wv.setAttribute('useragent', c.mobile ? mobileUA() : (boot.ua || '')); wv.setAttribute('src', c.url);
    wv.addEventListener('dom-ready', () => { c.ready = true; if (D.b.dark) wv.insertCSS(DARKCSS).catch(() => {}); if (c.muted) { try { wv.setAudioMuted(true); } catch {} } paintBr(); });
    wv.addEventListener('did-start-loading', () => { c.loading = true; paintBr(); });
    wv.addEventListener('did-stop-loading', () => { c.loading = false; try { c.url = wv.getURL(); } catch {} paintBr(); });
    wv.addEventListener('page-title-updated', e => { c.title = e.title; if (D.b.hist[0] && D.b.hist[0].url === c.url) D.b.hist[0].title = e.title; paintBr(); });
    wv.addEventListener('page-favicon-updated', e => { c.fav = (e.favicons || [])[0] || ''; paintBr(); });
    wv.addEventListener('did-navigate', e => { if (c === bcur()) BR.media = []; c.url = e.url; histAdd(c); syncSess(); paintBr(); });
    wv.addEventListener('did-navigate-in-page', e => { if (e.isMainFrame) { c.url = e.url; paintBr(); } });
    wv.addEventListener('media-started-playing', () => { c.audible = true; paintBr(); }); wv.addEventListener('media-paused', () => { c.audible = false; paintBr(); });
    wv.addEventListener('focus', () => { if (BR.ap !== c.pane) { BR.ap = c.pane; paintBr(); } });
    bhost.append(wv); c.wv = wv; paintBr();
  });
}
function newTab(o = {}) {
  const c = { id: ++BR.n, kind: o.kind || 'web', url: o.url || '', title: '', fav: '', priv: !!o.priv, ct: o.ct || '', pane: D.b.cols === 2 ? (o.pane != null ? o.pane : BR.ap) : 0, pin: !!o.pin,
    muted: false, audible: false, loading: false, ready: false, wv: null, mobile: false, at: Date.now(), fsv: 0, fs: { path: '', back: [], fwd: [], items: [], drives: [], known: [], err: '' } };
  BR.tabs.push(c); const i = BR.tabs.length - 1;
  if (!o.bg) { BR.cur[c.pane] = i; BR.ap = c.pane; } else if (BR.cur[c.pane] < 0) BR.cur[c.pane] = i;
  if (c.kind === 'fs') fsGo(c, o.path || '', false);
  paintBr(); syncSess(); return c;
}
function closeTab(i) {
  const c = BR.tabs[i]; if (!c) return;
  if (c.kind === 'web' && c.url && !c.priv) { BR.closed.unshift({ url: c.url, ct: c.ct, pane: c.pane }); BR.closed.length = Math.min(BR.closed.length, 15); }
  if (c.wv) c.wv.remove(); BR.tabs.splice(i, 1); BR.cur = BR.cur.map(x => x > i ? x - 1 : x === i ? -1 : x); fixCur();
  if (!BR.tabs.length) newTab({}); paintBr(); syncSess();
}
function selectTab(i) { const c = BR.tabs[i]; if (!c) return; BR.cur[c.pane] = i; BR.ap = c.pane; paintBr(); }
function setCols(n) {
  D.b.cols = n; save();
  if (n === 1) { BR.tabs.forEach(x => { x.pane = 0; }); BR.cur[1] = -1; BR.ap = 0; fixCur(); } else if (!BR.tabs.some(x => x.pane === 1)) newTab({ pane: 1 });
  render();
}
function movePane(i) { const c = BR.tabs[i]; if (!c || D.b.cols !== 2) return; const old = c.pane; c.pane = 1 - old; if (BR.cur[old] === i) BR.cur[old] = -1; BR.cur[c.pane] = i; BR.ap = c.pane; fixCur(); paintBr(); }
function toggleMute(x) { x.muted = !x.muted; if (x.wv && x.ready) { try { x.wv.setAudioMuted(x.muted); } catch {} } paintBr(); }
function navTo(u) {
  let c = bcur(); if (!c) { newTab({ url: u }); return; }
  if (c.kind === 'fs') c.kind = 'web';
  c.url = u; c.ready = false; if (!c.wv) mkWv(c); else c.wv.setAttribute('src', u); paintBr();
}
const wvDo = f => { const c = bcur(); if (c && c.kind === 'web' && c.wv && c.ready) { try { return f(c.wv, c); } catch {} } };
function openWeb(u) { tab = 'browser'; if (!BR.init) { BR.init = 1; initBr(); } newTab({ url: u }); render(); }
function openExplorer(p) { tab = 'browser'; if (!BR.init) { BR.init = 1; initBr(); } newTab({ kind: 'fs', path: p || '' }); render(); }
function initBr() {
  const s = D.b.sess || []; if (D.b.cols !== 2) D.b.cols = 1;
  s.forEach((e, i) => { const o = typeof e === 'string' ? { u: e } : e; newTab({ kind: o.k === 'fs' ? 'fs' : 'web', url: o.u, path: o.path, pin: o.pin, ct: o.ct, pane: o.pane, bg: i > 0 }); });
  if (!BR.tabs.length) newTab({}); if (D.b.cols === 2 && !BR.tabs.some(x => x.pane === 1)) newTab({ pane: 1, bg: true });
}
function placeBrowser() {
  const on = tab === 'browser'; bhost.style.visibility = on ? 'visible' : 'hidden'; if (!on) return;
  BR.tabs.forEach((x, i) => {
    if (!x.wv) return; const pe = $('#bp' + x.pane), vis = x.kind === 'web' && x.url && BR.cur[x.pane] === i && pe;
    if (!vis) { x.wv.style.display = 'none'; return; }
    const r = pe.getBoundingClientRect(); Object.assign(x.wv.style, { display: 'flex', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  });
}
addEventListener('resize', placeBrowser);
// ----- built-in file explorer -----
const parentOf = p => { if (!p) return ''; const m = p.replace(/[\\/]+$/, ''); if (/^[A-Za-z]:$/.test(m)) return ''; const q = m.replace(/[\\/][^\\/]*$/, ''); return /^[A-Za-z]:$/.test(q) ? q + '\\' : q; };
const joinP = (a, b) => a.replace(/[\\/]+$/, '') + '\\' + b;
const EXT = [[/\.(png|jpe?g|gif|webp|bmp|svg|ico)$/i, '🖼️'], [/\.(mp4|mkv|avi|mov|wmv|webm|m4v)$/i, '🎬'], [/\.(mp3|flac|wav|ogg|m4a|aac|opus)$/i, '🎵'], [/\.(zip|rar|7z|tar|gz)$/i, '🗜️'], [/\.(exe|msi|bat|lnk)$/i, '⚙️'], [/\.pdf$/i, '📕'], [/\.(txt|md|log|json|xml|csv)$/i, '📝'], [/\.(docx?|xlsx?|pptx?)$/i, '📄']];
async function fsGo(c, p, push = true) {
  const f = c.fs; if (push) { f.back.push(f.path); f.fwd = []; }
  f.path = p; f.err = '';
  if (!p) { f.drives = await api.fsDrives(); f.known = await api.fsKnown(); f.items = []; }
  else { const r = await api.fsList(p); if (r.error) { f.err = r.error; f.items = []; } else f.items = r.items.sort((a, b) => (b.d - a.d) || a.n.localeCompare(b.n, undefined, { numeric: true })); }
  c.title = p ? (p.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || p) : t('sys_thispc'); c.fsv++; paintBr(); syncSess();
}
function openFsFile(p) {
  const lo = p.toLowerCase();
  if (MEXT.video.some(e => lo.endsWith(e))) { tab = 'video'; addMedia('video', [p]); render(); }
  else if (MEXT.music.some(e => lo.endsWith(e))) { tab = 'music'; addMedia('music', [p]); render(); }
  else api.launch({ type: 'app', id: '', path: p });
}
function fsView(c) {
  const f = c.fs, go = p => fsGo(c, p), rt = D.s.lang !== 'en', nb = (l, fn, ttl) => h('button', { class: 'rb sm', title: ttl, onclick: fn }, l);
  const pin = h('input', { class: 'brurl', value: f.path || t('sys_thispc'), onkeydown: e => { if (e.key === 'Enter') { const v = e.target.value.trim(); go(!v || v === t('sys_thispc') ? '' : v); } } });
  const back = () => { if (f.back.length) { f.fwd.push(f.path); fsGo(c, f.back.pop(), false); } }, fwd = () => { if (f.fwd.length) { f.back.push(f.path); fsGo(c, f.fwd.pop(), false); } };
  const bar = h('div', { class: 'brbar fsbar' }, nb(rt ? '▶' : '◀', back), nb(rt ? '◀' : '▶', fwd), nb('↑', () => go(parentOf(f.path))), pin, nb('⟳', () => fsGo(c, f.path, false)), nb('↗', () => api.launch({ type: 'folder', id: '', path: f.path || 'C:\\' }), t('ex_win')));
  let body;
  if (!f.path) {
    body = h('div', { class: 'fsb' }, h('h4', {}, t('ex_quick')), h('div', { class: 'fsq' }, f.known.map(([k, p]) => h('div', { class: 'tile', onclick: () => go(p) }, h('span', { class: 'ic', style: '--z:40px' }, '📁'), h('span', { class: 'nm' }, p.split(/[\\/]/).pop())))),
      h('h4', {}, t('sys_thispc')), f.drives.map(d => h('div', { class: 'fsd', onclick: () => go(d.p) }, h('span', { class: 'ic', style: '--z:34px' }, '💽'), h('div', { class: 'dmb' }, h('b', {}, d.p), h('div', { class: 'bar' }, h('i', { style: `width:${d.t ? (d.t - d.f) / d.t * 100 : 0}%` })), h('small', {}, d.t ? `${B(d.f)} ${t('free')} / ${B(d.t)}` : '')))));
  } else {
    body = h('div', { class: 'fsb' }, f.err ? h('div', { class: 'empty' }, f.err) : h('table', { class: 'dt' }, h('thead', {}, h('tr', {}, h('th', {}, t('name')), h('th', {}, t('ex_mod')), h('th', {}, t('ex_size')))),
      h('tbody', {}, f.items.map(it => {
        const full = joinP(f.path, it.n), open = () => { if (it.d) go(full); else openFsFile(full); };
        return h('tr', { onclick: open, oncontextmenu: e => { e.preventDefault(); popMenu(e, [[t('launch'), open], [t('ex_copy'), () => { navigator.clipboard.writeText(full).catch(() => {}); toast('✓'); }], [t('ex_win'), () => api.launch({ type: 'folder', id: '', path: it.d ? full : f.path })]]); } },
          h('td', {}, h('span', { class: 'ic', style: '--z:20px' }, it.d ? '📁' : ((EXT.find(([r]) => r.test(it.n)) || [0, '📄'])[1])), it.n), h('td', {}, it.m ? fmtc({ dateStyle: 'medium', timeStyle: 'short' }, tzv()).format(it.m) : ''), h('td', {}, it.d ? '' : B(it.s)));
      }))));
  }
  return h('div', { class: 'fsw' }, bar, body);
}
// ----- speed dial (editable) -----
const dialList = () => D.b.dial || DIAL.map(([t_, u]) => ({ t: t_, u }));
const dialSet = a => { D.b.dial = a; save(); render(); };
function dialMove(a, b) { if (a < 0 || a === b) return; const l = [...dialList()], [x] = l.splice(a, 1); l.splice(b, 0, x); dialSet(l); }
async function dialAdd() { const n = await ask(t('name')); if (!n) return; const u = await ask('URL', 'https://'); if (!u) return; dialSet([...dialList(), { t: n, u: toUrl(u) }]); }
function dialMenu(e, i) {
  popMenu(e, [[t('b_edit'), async () => { const l = [...dialList()], n = await ask(t('name'), l[i].t); if (!n) return; const u = await ask('URL', l[i].u); if (!u) return; l[i] = { t: n, u: toUrl(u) }; dialSet(l); }],
    [t('b_rem'), () => { const l = [...dialList()]; l.splice(i, 1); dialSet(l); }], [t('b_rst'), () => { D.b.dial = null; save(); render(); }]]);
}
function dialEl() {
  const tile = (x, i) => h('div', { class: 'tile', draggable: 'true', onclick: () => navTo(x.u), oncontextmenu: e => { e.preventDefault(); dialMenu(e, i); },
    ondragstart: () => { BR.dd = i; }, ondragover: e => e.preventDefault(), ondrop: e => { e.preventDefault(); e.stopPropagation(); dialMove(BR.dd, i); } },
    h('img', { src: 'https://www.google.com/s2/favicons?domain=' + hostOf(x.u) + '&sz=64', width: 40, height: 40 }), h('span', { class: 'nm' }, x.t));
  return h('div', { class: 'dial' }, dialList().map(tile), h('div', { class: 'tile', onclick: dialAdd }, h('span', { class: 'ic bd', style: '--z:40px' }, '＋'), h('span', { class: 'nm' }, t('add'))));
}
// ----- painting -----
function paintPane(p) {
  const el = $('#bp' + p); if (!el) return; const c = BR.tabs[BR.cur[p]];
  el.classList.toggle('act', D.b.cols === 2 && BR.ap === p);
  const key = c ? `${c.id}:${c.kind}:${c.url ? 1 : 0}:${c.fsv}:${D.s.lang}` : 'none';
  if (el._k === key) return; el._k = key;
  el.replaceChildren(...(c && c.kind === 'fs' ? [fsView(c)] : !c || !c.url ? [dialEl()] : []));
}
function paintBr() {
  BR.tabs.forEach((x, i) => { if (x.kind === 'web' && x.url && !x.wv && (i === BR.cur[0] || i === BR.cur[1])) mkWv(x); });
  [0, 1].forEach(i => { const x = BR.tabs[BR.cur[i]]; if (x) x.at = Date.now(); });
  const tb = $('#brtabs'), c = bcur();
  if (tb) {
    const order = BR.tabs.map((_, i) => i).sort((a, b) => (BR.tabs[b].pin ? 1 : 0) - (BR.tabs[a].pin ? 1 : 0) || a - b);
    tb.replaceChildren(...order.map(i => {
      const x = BR.tabs[i], on = i === BR.cur[BR.ap], on2 = D.b.cols === 2 && i === BR.cur[1 - BR.ap], ct = CONT.find(k => k[0] === x.ct);
      return h('div', { class: 'bt' + (on ? ' on' : on2 ? ' on2' : '') + (x.pin ? ' pin' : ''), style: ct ? `border-bottom:3px solid ${ct[1]}` : '', title: x.title || x.url, onclick: () => selectTab(i), oncontextmenu: e => { e.preventDefault(); tabMenu(e, i); } },
        x.kind === 'fs' ? h('span', {}, '🗂️') : x.fav ? h('img', { src: x.fav }) : h('span', {}, x.priv ? '🕶' : '🌐'),
        x.pin ? null : h('span', { class: 'nm' }, (D.b.cols === 2 ? (x.pane ? '◨ ' : '◧ ') : '') + (x.title || hostOf(x.url) || t('b_new'))),
        x.audible || x.muted ? h('span', { class: 'au', onclick: e => { e.stopPropagation(); toggleMute(x); } }, x.muted ? '🔇' : '🔊') : null, x.loading ? h('i', { class: 'spn' }) : null,
        x.pin ? null : h('button', { onclick: e => { e.stopPropagation(); closeTab(i); } }, '✕'));
    }), h('button', { class: 'bt plus', title: t('b_new'), onclick: () => newTab({}), oncontextmenu: e => { e.preventDefault(); plusMenu(e); } }, '＋'), h('button', { class: 'bt plus', onclick: plusMenu }, '▾'));
  }
  const u = $('#brurl'); if (u && document.activeElement !== u) u.value = c ? (c.kind === 'fs' ? (c.fs.path || t('sys_thispc')) : c.url) : '';
  const mb = $('#brmedia'); if (mb) mb.textContent = '📥 ' + BR.media.length;
  const st = $('#brstar'); if (st) st.textContent = c && c.url && D.b.bm.some(b => b.url === c.url) ? '★' : '☆';
  paintPane(0); paintPane(1); placeBrowser();
}
function toggleBm() {
  const c = bcur(); if (!c || !c.url) return; const i = D.b.bm.findIndex(b => b.url === c.url);
  if (i >= 0) D.b.bm.splice(i, 1); else D.b.bm.push({ url: c.url, title: c.title || hostOf(c.url) }); save(); render();
}
// ----- menus -----
const mediaMenu = e => popMenu(e, BR.media.length ? BR.media.map(m => [`${m.type.split('/')[1] || m.type} · ${B(m.size)} · ${hostOf(m.url)}`, () => dmAddUrl(m.url, m.referer)]) : [[t('b_empty'), () => {}]]);
function plusMenu(e) {
  popMenu(e, [[t('b_new'), () => newTab({})], [t('b_explorer'), () => newTab({ kind: 'fs' })], [t('b_priv'), () => newTab({ priv: true })], ...CONT.map(([k]) => [t('b_ctr') + ': ' + k, () => newTab({ ct: k })]), ...(BR.closed.length ? [[t('b_reopen'), reopenTab]] : [])]);
}
function reopenTab() { const x = BR.closed.shift(); if (x) newTab({ url: x.url, ct: x.ct, pane: x.pane }); }
function tabMenu(e, i) {
  const x = BR.tabs[i];
  popMenu(e, [[x.pin ? t('b_unpin') : t('b_pin'), () => { x.pin = !x.pin; paintBr(); syncSess(); }], [t('b_dup'), () => newTab({ kind: x.kind, url: x.url, path: x.fs.path, ct: x.ct, priv: x.priv })],
    ...(x.kind === 'web' ? [[x.muted ? t('b_unmute') : t('b_mute'), () => toggleMute(x)], [t('b_reload'), () => { if (x.wv && x.ready) x.wv.reload(); }]] : []),
    ...(D.b.cols === 2 ? [[t('b_pane'), () => movePane(i)]] : []),
    [t('b_closeo'), () => { for (let k = BR.tabs.length - 1; k >= 0; k--) if (k !== i && !BR.tabs[k].pin) closeTab(k); }], [t('b_rem'), () => closeTab(BR.tabs.indexOf(x))]]);
}
function brMenu(e) {
  const B2 = D.b, c = bcur(), web = c && c.kind === 'web';
  popMenu(e, [[t('b_priv'), () => newTab({ priv: true })], [t('b_explorer'), () => newTab({ kind: 'fs' })], ...(BR.closed.length ? [[t('b_reopen'), reopenTab]] : []),
    [t('b_find'), () => { BR.find = true; render(); setTimeout(() => { const f = $('#brfind'); if (f) f.focus(); }, 30); }],
    [t('b_print'), () => wvDo(w => w.print())], [t('b_shot'), () => wvDo(async w => { const img = await w.capturePage(); const f = await api.shot(img.toDataURL()); toast('📷 ' + f); })],
    [t('b_tr'), () => { if (web && c.url) navTo('https://translate.google.com/translate?sl=auto&tl=' + D.s.lang + '&u=' + encodeURIComponent(c.url)); }],
    [t('b_aloud'), () => wvDo(w => w.executeJavaScript(ALOUD))], [t('b_read'), () => wvDo(w => w.executeJavaScript(READER))], [t('b_pip'), () => wvDo(w => w.executeJavaScript(PIPJS, true))],
    [(B2.dark ? '✓ ' : '') + t('b_dark'), () => { B2.dark = !B2.dark; save(); BR.tabs.forEach(x => { if (x.wv && x.ready) { if (B2.dark) x.wv.insertCSS(DARKCSS).catch(() => {}); else x.wv.reload(); } }); }],
    [((c && c.mobile) ? '✓ ' : '') + t('b_mobile'), () => { if (web && c.wv) { c.mobile = !c.mobile; try { c.wv.setUserAgent(c.mobile ? mobileUA() : (boot.ua || '')); c.wv.reload(); } catch {} } }],
    [t('b_src'), () => { if (web && c.url) newTab({ url: 'view-source:' + c.url }); }], [t('b_dev'), () => wvDo(w => w.openDevTools())],
    [t('b_zin'), () => wvDo(w => w.setZoomLevel(w.getZoomLevel() + .5))], [t('b_zout'), () => wvDo(w => w.setZoomLevel(w.getZoomLevel() - .5))], [t('b_zrst'), () => wvDo(w => w.setZoomLevel(0))],
    [(B2.vt ? '✓ ' : '') + t('b_vt'), () => { B2.vt = !B2.vt; save(); render(); }],
    ...Object.keys(ENG).map(k => [(B2.engine === k ? '● ' : '○ ') + t('b_eng') + ': ' + k, () => { B2.engine = k; save(); }]),
    [t('b_ext'), () => { if (web && c.url) api.launch({ type: 'url', id: '', path: c.url }); }]]);
}
function brPanel() {
  const B2 = D.b; if (!B2.panel) return null;
  const row = (ti, sub, fn, del) => h('div', { class: 'pi', onclick: fn }, h('span', { class: 'nm', title: sub }, ti), del ? h('button', { onclick: e => { e.stopPropagation(); del(); } }, '✕') : null);
  let body;
  if (B2.panel === 'bm') body = B2.bm.length ? B2.bm.map((b, i) => row(b.title, b.url, () => navTo(b.url), () => { B2.bm.splice(i, 1); save(); render(); })) : [h('div', { class: 'empty' }, t('b_empty'))];
  else if (B2.panel === 'hist') {
    const q = h('input', { placeholder: t('search'), value: BR.hq }), box = h('div', {}), fill = () => { const f = q.value.toLowerCase(); BR.hq = q.value; box.replaceChildren(...(B2.hist.filter(x => !f || (x.title + x.url).toLowerCase().includes(f)).slice(0, 200).map(x => row(x.title, x.url, () => navTo(x.url))))); };
    q.oninput = fill; fill(); body = [h('div', { class: 'row' }, q, h('button', { onclick: () => { B2.hist = []; save(); render(); } }, t('b_clr'))), box];
  } else if (B2.panel === 'apps') body = D.items.filter(i => i.type === 'web' && !i.hidden).map(i => h('div', { class: 'tile row1', onclick: () => newTab({ url: i.path }) }, icon(i, 24), h('span', { class: 'nm' }, dn(i))));
  else body = [h('button', { class: 'pr', onclick: () => { tab = 'downloads'; render(); } }, '⬇ ' + t('downloads')), ...(DMS.jobs.slice(0, 8).map(j => row((j.status === 'completed' ? '✓ ' : '… ') + j.name, j.url, () => {})))];
  return h('div', { class: 'brpanel card' }, h('h3', {}, t(B2.panel === 'bm' ? 'b_bm' : B2.panel === 'hist' ? 'b_hist' : B2.panel === 'apps' ? 'b_apps' : 'b_dl')), body);
}
function brView() {
  const B2 = D.b, rt = D.s.lang !== 'en', nb = (l, fn, ttl, cls) => h('button', { class: 'rb sm ' + (cls || ''), title: ttl, onclick: fn }, l);
  const panel = k => () => { B2.panel = B2.panel === k ? null : k; save(); render(); };
  const url = h('input', { id: 'brurl', class: 'brurl', placeholder: t('b_ph'), onkeydown: e => { if (e.key === 'Enter') { const c = bcur(), v = e.target.value; if (c && c.kind === 'fs') fsGo(c, v.trim() === t('sys_thispc') ? '' : v.trim()); else { const u2 = toUrl(v); if (u2) navTo(u2); } e.target.blur(); } } });
  url.addEventListener('focus', () => url.select());
  const bar = h('div', { class: 'brbar' }, nb(rt ? '▶' : '◀', () => wvDo(w => { if (w.canGoBack()) w.goBack(); }), 'Alt+←'), nb(rt ? '◀' : '▶', () => wvDo(w => { if (w.canGoForward()) w.goForward(); }), 'Alt+→'), nb('⟳', () => wvDo(w => w.reload()), 'Ctrl+R'),
    nb('⌂', () => { const c = bcur(); if (c) { c.kind = 'web'; c.url = ''; paintBr(); } }), url, h('button', { id: 'brstar', class: 'rb sm', onclick: toggleBm, title: 'Ctrl+D' }, '☆'),
    h('button', { id: 'brmedia', class: 'chip', title: t('b_media'), onclick: mediaMenu }, '📥 ' + BR.media.length),
    h('button', { class: 'rb sm' + (B2.adblock ? ' on' : ''), title: t('b_blk'), onclick: () => { B2.adblock = !B2.adblock; api.adblock(B2.adblock); save(); render(); } }, '🛡 ', h('span', { id: 'brblk' }, String(BR.blk))),
    nb(B2.cols === 2 ? '◫' : '▢', () => setCols(B2.cols === 2 ? 1 : 2), t('b_cols'), B2.cols === 2 ? 'on' : ''), nb('🗂️', () => newTab({ kind: 'fs' }), t('b_explorer')),
    nb('📑', panel('bm'), t('b_bm'), B2.panel === 'bm' ? 'on' : ''), nb('📜', panel('hist'), t('b_hist'), B2.panel === 'hist' ? 'on' : ''), nb('🧭', panel('apps'), t('b_apps'), B2.panel === 'apps' ? 'on' : ''), nb('⬇', panel('dl'), t('b_dl'), B2.panel === 'dl' ? 'on' : ''), nb('⋯', brMenu));
  const find = BR.find ? h('div', { class: 'brbar' }, h('input', { id: 'brfind', placeholder: t('b_find'), style: 'flex:1', onkeydown: e => {
    if (e.key === 'Enter') wvDo(w => { if (e.target.value) w.findInPage(e.target.value, { forward: !e.shiftKey, findNext: true }); });
    if (e.key === 'Escape') { wvDo(w => w.stopFindInPage('clearSelection')); BR.find = false; render(); } } }), nb('✕', () => { wvDo(w => w.stopFindInPage('clearSelection')); BR.find = false; render(); })) : null;
  const bms = B2.bm.length ? h('div', { class: 'bmbar' }, B2.bm.slice(0, 14).map(b => h('button', { class: 'chip', onclick: () => navTo(b.url) }, b.title.slice(0, 20)))) : null;
  const act = p => () => { if (BR.ap !== p) { BR.ap = p; paintBr(); } };
  const panes = h('div', { class: 'panes' }, h('div', { id: 'bp0', class: 'bpane', onmousedown: act(0) }), B2.cols === 2 ? h('div', { id: 'bp1', class: 'bpane', onmousedown: act(1) }) : null, brPanel());
  return h('div', { class: 'brw' + (B2.vt ? ' vt' : '') }, h('div', { id: 'brtabs', class: 'brtabs' }), h('div', { class: 'brmain' }, bar, find, bms, panes));
}
api.onBrOpen(u => { newTab({ url: u }); if (tab === 'browser') render(); });
api.onMedia(m => { if (!BR.media.some(x => x.url === m.url)) { BR.media.unshift(m); BR.media.length = Math.min(BR.media.length, 15); const mb = $('#brmedia'); if (mb) mb.textContent = '📥 ' + BR.media.length; } });
setInterval(() => { BR.tabs.forEach((x, i) => { if (x.wv && i !== BR.cur[0] && i !== BR.cur[1] && !x.loading && !x.audible && Date.now() - (x.at || 0) > 600000) { x.wv.remove(); x.wv = null; x.ready = false; } }); }, 60000);
api.onBlocked(n => { BR.blk = n; const e = $('#brblk'); if (e) e.textContent = String(n); });
document.addEventListener('keydown', e => {
  if (tab !== 'browser' || !e.ctrlKey || document.querySelector('.ov')) return; const k = e.key.toLowerCase();
  if (k === 't' && e.shiftKey) { e.preventDefault(); reopenTab(); } else if (k === 't') { e.preventDefault(); newTab({}); } else if (k === 'w') { e.preventDefault(); closeTab(BR.cur[BR.ap]); } else if (k === 'l') { e.preventDefault(); const u = $('#brurl'); if (u) u.focus(); }
  else if (k === 'f') { e.preventDefault(); BR.find = true; render(); setTimeout(() => { const f = $('#brfind'); if (f) f.focus(); }, 30); } else if (k === 'r') { e.preventDefault(); wvDo(w => w.reload()); }
  else if (k === 'd') { e.preventDefault(); toggleBm(); } else if (k === 'p') { e.preventDefault(); wvDo(w => w.print()); }
  else if (k === 'tab') { e.preventDefault(); const l = BR.tabs.map((_, i) => i).filter(i => BR.tabs[i].pane === BR.ap), j = l.indexOf(BR.cur[BR.ap]); selectTab(l[(j + (e.shiftKey ? l.length - 1 : 1)) % l.length]); }
  else if (/^[1-8]$/.test(k)) { const l = BR.tabs.map((_, i) => i).filter(i => BR.tabs[i].pane === BR.ap); if (l[+k - 1] != null) { e.preventDefault(); selectTab(l[+k - 1]); } }
});

// ---------- weather (Open-Meteo forecast + air quality, Nominatim/Open-Meteo place search, Windows location) ----------
const WX = { manual: false, fail: false, busy: false, err: '', auto: false };
const WC = c => c === 0 ? ['☀️', 'wc_clear'] : c <= 2 ? ['⛅', 'wc_part'] : c === 3 ? ['☁️', 'wc_cloud'] : c <= 48 ? ['🌫️', 'wc_fog'] : c <= 57 ? ['🌦️', 'wc_drz'] : c <= 67 ? ['🌧️', 'wc_rain'] : c <= 77 ? ['❄️', 'wc_snow'] : c <= 82 ? ['🌦️', 'wc_rain'] : c <= 86 ? ['🌨️', 'wc_snow'] : ['⛈️', 'wc_thun'];
const WS = (c, day) => c >= 95 ? 'storm' : (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'snow' : c >= 51 && c <= 82 ? 'rain' : c === 45 || c === 48 ? 'fog' : !day ? 'night' : c >= 2 ? 'cloud' : 'sun';
const geoName = a => [a.city || a.town || a.village || a.suburb || a.county, a.state, a.country].filter(Boolean).join(', ');
async function revName(lat, lon) { const r = await api.json(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=${D.s.lang}&lat=${lat}&lon=${lon}`); return r.data && r.data.address ? geoName(r.data.address) : ''; }
async function setLoc(l) { if (l.auto && (!l.name || l.name === t('w_my'))) { const n = await revName(l.lat, l.lon); if (n) l.name = n; } D.weather.loc = l; D.weather.cache = null; save(); WX.manual = false; WX.fail = false; WX.err = ''; wxFetch(); }
async function wxFetch() {
  const L = D.weather.loc; if (!L || WX.busy) return; WX.busy = true; WX.err = ''; if (tab === 'weather') render();
  const base = `https://api.open-meteo.com/v1/forecast?latitude=${L.lat}&longitude=${L.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,cloud_cover,wind_speed_10m,wind_gusts_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=7`;
  const MODELS = ['ecmwf_ifs025', 'gfs_seamless', 'icon_seamless'], avg = (D.weather.model || 'avg') === 'avg';
  const [r, aq, ...ms] = await Promise.all([api.json(base), api.json(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${L.lat}&longitude=${L.lon}&current=us_aqi,pm2_5,pm10&timezone=auto`), ...(avg ? MODELS.map(m => api.json(base + '&models=' + m)) : [])]);
  WX.busy = false;
  if (r.data && r.data.current) {
    const d = r.data, ok = ms.filter(x => x.data && x.data.current && x.data.hourly && x.data.daily).map(x => x.data), all = [d, ...ok];
    if (ok.length) {
      const mean = a => { const v = a.filter(x => typeof x === 'number'); return v.length ? v.reduce((p, q) => p + q, 0) / v.length : null; };
      ['temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'surface_pressure', 'cloud_cover', 'wind_speed_10m', 'wind_gusts_10m'].forEach(k => { const m = mean(all.map(x => x.current[k])); if (m != null) d.current[k] = m; });
      d.hourly.temperature_2m = d.hourly.temperature_2m.map((v, i) => { const m = mean(all.map(x => x.hourly.temperature_2m && x.hourly.temperature_2m[i])); return m != null ? m : v; });
      ['temperature_2m_max', 'temperature_2m_min'].forEach(k => { d.daily[k] = d.daily[k].map((v, i) => { const m = mean(all.map(x => x.daily[k] && x.daily[k][i])); return m != null ? m : v; }); });
    }
    d.nmodels = all.length; D.weather.cache = { at: Date.now(), d, aq: aq.data && aq.data.current ? aq.data.current : null }; save();
  } else WX.err = t('w_err');
  if (tab === 'weather') render();
}
function wxEnter() {
  const W = D.weather; if (!W.loc || WX.busy) return;
  if (W.loc.auto && !WX.auto) { WX.auto = true; api.geo().then(g => { if (g) { W.loc = { ...W.loc, lat: g.lat, lon: g.lon }; save(); wxFetch(); } }); }
  if (!WX.err && (!W.cache || Date.now() - W.cache.at > 9e5)) wxFetch();
}
const moonEmoji = () => ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][Math.round(((((Date.now() / 86400000 + 2440587.5 - 2451550.1) % 29.530588) + 29.530588) % 29.530588) / 29.530588 * 8) % 8];
const wxChart = (vals, pr) => { const mn = Math.min(...vals), mx = Math.max(...vals), w = 240, hh = 60, sx = i => i * (w / (vals.length - 1)), sy = v => hh - 8 - (v - mn) / Math.max(1, mx - mn) * (hh - 22);
  return `<svg viewBox="0 0 ${w} ${hh}" preserveAspectRatio="none" style="width:100%;height:90px">${pr.map((p, i) => `<rect x="${sx(i) - 3}" y="${hh - p * .3}" width="6" height="${p * .3}" fill="rgba(80,160,255,.35)"/>`).join('')}<polyline fill="none" stroke="var(--ac)" stroke-width="2" points="${vals.map((v, i) => sx(i) + ',' + sy(v)).join(' ')}"/></svg>`; };
function weatherView() {
  const W = D.weather, L = W.loc;
  if (!L || WX.manual) {
    const q = h('input', { placeholder: t('w_search') }), res = h('div', { class: 'apl' });
    const doS = async () => {
      const q0 = q.value.trim(); if (!q0) return; res.textContent = '…';
      const [a, b] = await Promise.all([api.json('https://geocoding-api.open-meteo.com/v1/search?count=6&language=' + D.s.lang + '&name=' + encodeURIComponent(q0)), api.json('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=' + D.s.lang + '&q=' + encodeURIComponent(q0))]);
      const out = []; ((a.data && a.data.results) || []).forEach(x => out.push({ lat: x.latitude, lon: x.longitude, name: [x.name, x.admin1, x.country].filter(Boolean).join(', ') }));
      if (Array.isArray(b.data)) b.data.forEach(x => { if (!out.some(o => Math.abs(o.lat - +x.lat) < .05 && Math.abs(o.lon - +x.lon) < .05)) out.push({ lat: +x.lat, lon: +x.lon, name: String(x.display_name).split(',').slice(0, 3).join(',').trim() }); });
      res.replaceChildren(...(out.length ? out.map(x => h('div', { class: 'pi', onclick: () => setLoc({ ...x }) }, '📍 ' + x.name)) : [h('div', { class: 'empty' }, t('b_empty'))]));
    };
    q.addEventListener('keydown', e => { if (e.key === 'Enter') doS(); });
    return h('div', { class: 'card wxask' }, h('h3', {}, t('w_ask')),
      !WX.manual ? h('div', { class: 'row' }, h('button', { class: 'pr', onclick: async () => { toast('…'); const g = await api.geo(); if (g) setLoc({ lat: g.lat, lon: g.lon, name: '', auto: true }); else { WX.fail = true; render(); } } }, t('w_allow')), h('button', { onclick: () => { WX.manual = true; render(); } }, t('w_manual'))) : null,
      WX.fail && !WX.manual ? h('div', { class: 'frm' }, h('p', {}, t('w_fail')), h('div', { class: 'row' }, h('button', { onclick: async () => { const r = await api.json('https://ipwho.is/'), d = r.data; if (d && d.latitude != null) setLoc({ lat: d.latitude, lon: d.longitude, name: [d.city, d.country].filter(Boolean).join(', ') || t('w_my') }); else toast(t('w_err')); } }, t('w_ip')), h('button', { onclick: () => { WX.manual = true; render(); } }, t('w_manual')))) : null,
      WX.manual ? h('div', { class: 'frm' }, h('div', { class: 'row' }, q, h('button', { class: 'pr', onclick: doS }, t('search')), L ? h('button', { onclick: () => { WX.manual = false; render(); } }, t('cancel')) : null), res) : null);
  }
  const d = W.cache && W.cache.d, aq = W.cache && W.cache.aq;
  const head = h('div', { class: 'bar2' }, h('b', { class: 'wxh1' }, '📍 ' + (L.name || t('w_my'))), h('button', { onclick: () => { WX.manual = true; render(); } }, t('w_cur')),
    h('button', { title: t('w_save'), onclick: () => { if (!W.saved.some(x => x.lat === L.lat && x.lon === L.lon)) W.saved.push({ lat: L.lat, lon: L.lon, name: L.name }); save(); render(); } }, '★'),
    h('button', { onclick: () => { WX.err = ''; wxFetch(); } }, '⟳'), sel([['kmh', 'km/h'], ['ms', 'm/s'], ['mph', 'mph']], W.wu || 'kmh', v => { W.wu = v; save(); render(); }),
    sel([['avg', t('w_avg')], ['best', t('w_best')]], W.model || 'avg', v => { W.model = v; W.cache = null; save(); wxFetch(); }),
    W.saved.map((x, i) => h('button', { class: 'chip', onclick: () => setLoc({ ...x }), oncontextmenu: e => { e.preventDefault(); W.saved.splice(i, 1); save(); render(); } }, (x.name || '').split(',')[0])));
  if (!d) return h('div', {}, head, h('div', { class: 'card' }, WX.busy ? '…' : (WX.err || '…')));
  const c = d.current, day = !!c.is_day, [em, lab] = WC(c.weather_code), dl = d.daily;
  const cv = h('canvas', {}); SENFX.create(cv, ['mountain', WS(c.weather_code, day), 'none'], () => true);
  let hi = d.hourly.time.findIndex(x => x >= c.time.slice(0, 13)); if (hi < 0) hi = 0;
  const wv = v => { const u = W.wu || 'kmh'; return u === 'ms' ? (v / 3.6).toFixed(1) + ' m/s' : u === 'mph' ? Math.round(v / 1.609) + ' mph' : Math.round(v) + ' km/h'; };
  const stat = (l, v) => h('div', { class: 'wxs' }, h('small', {}, l), h('b', {}, v));
  const wd = x => new Intl.DateTimeFormat(loc(), { weekday: 'short' }).format(new Date(x + 'T12:00:00'));
  const radar = ov => () => openWeb(`https://embed.windy.com/embed2.html?lat=${L.lat}&lon=${L.lon}&detailLat=${L.lat}&detailLon=${L.lon}&zoom=7&level=surface&overlay=${ov}&product=ecmwf&marker=true`);
  const aqi = aq && aq.us_aqi != null ? aq.us_aqi : null, aqk = aqi == null ? null : 'aq' + (aqi <= 50 ? 1 : aqi <= 100 ? 2 : aqi <= 150 ? 3 : aqi <= 200 ? 4 : aqi <= 300 ? 5 : 6);
  const t24 = d.hourly.temperature_2m.slice(hi, hi + 24), p24 = d.hourly.precipitation_probability.slice(hi, hi + 24).map(x => x || 0);
  return h('div', { class: 'wxpage' }, h('div', { class: 'wxbgw' }, cv),
    h('div', { class: 'wxin' }, head, WX.err ? h('div', { class: 'card' }, WX.err) : null,
      h('div', { class: 'wxhero' }, h('div', { class: 'wxt' }, em + ' ' + temp(c.temperature_2m)), h('div', {}, t(lab) + ' · ' + t('w_feels') + ' ' + temp(c.apparent_temperature)), d.nmodels > 1 ? h('small', {}, t('w_avgnote')) : null),
      h('div', { class: 'wxg' }, stat(t('w_hum'), Math.round(c.relative_humidity_2m) + '%'), stat(t('w_wind'), wv(c.wind_speed_10m)), stat(t('w_gust'), wv(c.wind_gusts_10m)), stat(t('w_cloud'), Math.round(c.cloud_cover) + '%'),
        stat(t('w_press'), Math.round(c.surface_pressure) + ' hPa'), stat(t('w_uv'), String(Math.round(dl.uv_index_max[0] * 10) / 10)), stat(t('w_sun'), dl.sunrise[0].slice(11, 16) + ' / ' + dl.sunset[0].slice(11, 16)),
        aqk ? stat(t('aq_l'), aqi + ' · ' + t(aqk)) : null, stat(t('w_moon'), moonEmoji())),
      h('div', { class: 'row', style: 'margin-bottom:12px' }, h('button', { onclick: radar('rain') }, '🛰 ' + t('w_rainmap')), h('button', { onclick: radar('wind') }, '💨 ' + t('w_windmap')), h('button', { onclick: radar('temp') }, '🌡 ' + t('w_tempmap'))),
      h('div', { class: 'card' }, h('h3', {}, t('w_hour')), h('div', { html: wxChart(t24, p24) }), h('div', { class: 'wxh' }, d.hourly.time.slice(hi, hi + 24).map((x, i) => h('div', { class: 'wxc' }, h('small', {}, x.slice(11, 16)), h('span', {}, WC(d.hourly.weather_code[hi + i])[0]), h('b', {}, temp(d.hourly.temperature_2m[hi + i])), h('small', {}, '💧' + p24[i] + '%'))))),
      h('div', { class: 'card' }, h('h3', {}, t('w_day')), dl.time.map((x, i) => h('div', { class: 'wxd' }, h('span', {}, wd(x)), h('span', {}, WC(dl.weather_code[i])[0]), h('small', {}, '💧' + (dl.precipitation_probability_max[i] || 0) + '%'), h('b', {}, temp(dl.temperature_2m_max[i]) + ' / ' + temp(dl.temperature_2m_min[i]))))),
      h('small', { class: 'mu' }, 'Open-Meteo · ECMWF · GFS · ICON · OpenStreetMap · Windy')));
}

// ---------- appearance (colour schemes + layout) ----------
const SCHEMES = [{ id: 'default' },
  { id: 'ocean', dark: 1, ac: '#2aa7ff', bg: '#0b1622', pn: '#122233', tx: '#e6f1fb', mu: '#8aa6bf', bd: '#1f3850' }, { id: 'emerald', dark: 1, ac: '#2ecc8f', bg: '#0c1713', pn: '#13241d', tx: '#e5f5ee', mu: '#86a897', bd: '#1f3a2f' },
  { id: 'sunset', dark: 1, ac: '#ff7a45', bg: '#1c0f14', pn: '#2a1820', tx: '#fbece6', mu: '#b99088', bd: '#43252d' }, { id: 'rose', dark: 0, ac: '#e0457b', bg: '#fdf1f5', pn: '#ffffff', tx: '#2a1520', mu: '#8b6573', bd: '#f0d3dd' },
  { id: 'sand', dark: 0, ac: '#c1862b', bg: '#f6f0e4', pn: '#fffdf8', tx: '#2d2616', mu: '#857a63', bd: '#e6dcc4' }, { id: 'midnight', dark: 1, ac: '#8b7bff', bg: '#07070f', pn: '#11111f', tx: '#ececff', mu: '#8e8eb3', bd: '#232340' },
  { id: 'cyber', dark: 1, ac: '#00f0c8', bg: '#070b10', pn: '#0e1620', tx: '#d8fff7', mu: '#6aa9a0', bd: '#123a3a' }, { id: 'mono', dark: 0, ac: '#222222', bg: '#ededed', pn: '#fafafa', tx: '#1a1a1a', mu: '#707070', bd: '#d4d4d4' }];
const CK = ['ac', 'bg', 'pn', 'tx', 'mu', 'bd'];
const lum = c => { const v = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); return (.299 * v[0] + .587 * v[1] + .114 * v[2]) / 255; };
const fix6 = c => { c = (c || '').trim(); return /^#[0-9a-f]{3}$/i.test(c) ? '#' + [...c.slice(1)].map(x => x + x).join('') : /^#[0-9a-f]{6}$/i.test(c) ? c : '#888888'; };
const cssv = k => fix6(getComputedStyle(document.documentElement).getPropertyValue('--' + k));
function applyLook(vars) {
  const L = D.look, r = document.documentElement, sc = [...SCHEMES, ...L.custom].find(x => x.id === L.scheme), v = vars || (sc && sc.ac ? sc : null);
  if (v) { CK.forEach(k => r.style.setProperty('--' + k, v[k])); r.dataset.t = (vars ? lum(v.bg) < .5 : v.dark) ? 'dark' : 'light'; } else CK.forEach(k => r.style.removeProperty('--' + k));
  r.style.setProperty('--actx', lum(cssv('ac')) > .62 ? '#111111' : '#ffffff');
  const g = L.layout; r.style.setProperty('--r', g.radius + 'px'); r.style.setProperty('--pa', (100 - g.glass * .45) + '%'); r.style.setProperty('--bl', (g.glass * .24) + 'px'); r.style.setProperty('--fz', g.font / 100); r.dataset.nav = g.nav; r.dataset.den = g.den;
}
function lookView() {
  const L = D.look, g = L.layout, all = [...SCHEMES, ...L.custom];
  const sw = x => h('div', { class: 'swc' + (L.scheme === x.id ? ' on' : ''), onclick: () => { L.scheme = x.id; save(); render(); } },
    x.ac ? h('div', { class: 'swp', style: `background:${x.bg};border-color:${x.bd}` }, h('i', { style: `background:${x.pn}` }), h('i', { style: `background:${x.ac}` }), h('i', { style: `background:${x.tx}` })) : h('div', { class: 'swp def' }, '✦'),
    h('span', {}, x.id === 'default' ? t('l_def') : x.name || t('sc_' + x.id)), x.name ? h('button', { onclick: e => { e.stopPropagation(); L.custom = L.custom.filter(c => c !== x); if (L.scheme === x.id) L.scheme = 'default'; save(); render(); } }, '✕') : null);
  const act = all.find(x => x.id === L.scheme), base = {}; CK.forEach(k => { base[k] = act && act[k] ? act[k] : cssv(k); });
  const draft = { ...base };
  const ins = CK.map(k => h('label', { class: 'cpk' }, t('c_' + k), h('input', { type: 'color', value: base[k], oninput: e => { draft[k] = e.target.value; applyLook(draft); } })));
  const lay = (lbl, ctl) => h('div', { class: 'srow' }, h('label', {}, lbl), ctl);
  const rng = (key, min, max, step) => h('input', { type: 'range', min, max, step, value: g[key], oninput: e => { g[key] = +e.target.value; applyLook(); }, onchange: () => save() });
  return h('div', { class: 'set' },
    h('section', { class: 'card' }, h('h3', {}, t('l_scheme')), h('div', { class: 'swg' }, all.map(sw))),
    h('section', { class: 'card' }, h('h3', {}, t('l_layout')),
      lay(t('l_nav'), sel([['side', t('l_side')], ['top', t('l_top')]], g.nav, v => { g.nav = v; save(); render(); })),
      lay(t('l_den'), sel([['compact', t('l_compact')], ['cozy', t('l_cozy')], ['roomy', t('l_roomy')]], g.den, v => { g.den = v; save(); render(); })),
      lay(t('l_rad'), rng('radius', 0, 28, 1)), lay(t('l_glass'), rng('glass', 0, 100, 1)), lay(t('l_font'), rng('font', 85, 125, 1))),
    h('section', { class: 'card' }, h('h3', {}, t('l_cust')), h('div', { class: 'cpg' }, ins),
      h('div', { class: 'row', style: 'margin-top:10px' }, h('button', { class: 'pr', onclick: async () => { const n = await ask(t('l_name')); if (!n) return; const id = 'c:' + Date.now(); L.custom.push({ id, name: n, dark: lum(draft.bg) < .5 ? 1 : 0, ...draft }); L.scheme = id; save(); render(); } }, t('l_sv')))));
}

// ---------- download manager (UI) ----------
const DMS = { jobs: [], cfg: null, f: 'all' };
const DCAT = { Video: '🎬', Music: '🎵', Documents: '📄', Programs: '⚙️', Compressed: '🗜️', Images: '🖼️', Other: '📦' };
api.dmList().then(r => { DMS.jobs = r.jobs; DMS.cfg = r.cfg; if (tab === 'downloads') paintDm(); });
api.onDm((ty, d) => { if (ty === 'all') DMS.jobs = d; else d.forEach(u => { const j = DMS.jobs.find(x => x.id === u.id); if (j) Object.assign(j, u); }); if (tab === 'downloads') paintDm(); });
api.onDmClip(async u => { if (document.querySelector('.ov')) return; const r = await modal(t('dm_clipq'), h('div', { class: 'pth2' }, u), [[t('cancel'), null], [t('dm_add'), true, 'pr']]); if (r) dmAddUrl(u); });
api.onDmDone(d => toast('✓ ' + d.name)); api.onDmCap(() => toast('⬇ ' + t('dm_added')));
const dmCall = (a, id) => api.dmAct(a, id);
function dmAddUrl(u, ref) { api.dmAdd([{ url: u, referer: ref || '' }]); toast('⬇ ' + t('dm_added')); }
const expandPat = u => { const m = /\[(\d+)-(\d+)\]/.exec(u); if (!m) return [u]; const a = +m[1], b = +m[2], w = m[1].length, out = []; for (let i = a; i <= b && out.length < 500; i++) out.push(u.replace(m[0], String(i).padStart(w, '0'))); return out; };
async function dmAddDlg() {
  const ta = h('textarea', { rows: 6, placeholder: 'https://…\nhttps://site/img[01-20].jpg' }), cn = sel([1, 2, 4, 8, 16, 32].map(n => [String(n), String(n)]), String((DMS.cfg && DMS.cfg.conn) || 8), () => {}), st = h('input', { type: 'checkbox', checked: true });
  const r = await modal(t('dm_add'), h('div', { class: 'frm' }, ta, h('small', {}, t('dm_urls')), h('label', {}, t('dm_conn') + ': ', cn), h('label', {}, st, ' ' + t('dm_start'))), [[t('cancel'), null], [t('dm_add'), true, 'pr']]);
  if (!r) return; const urls = ta.value.split(/\s+/).filter(x => /^https?:\/\//i.test(x)).flatMap(expandPat);
  if (!urls.length) { toast(t('invalid')); return; } api.dmAdd(urls.map(u => ({ url: u, conn: +cn.value, paused: !st.checked }))); toast('⬇ ' + urls.length);
}
async function dmSettings() {
  const c = DMS.cfg; if (!c) return; const sv = p => api.dmCfg(p).then(x => { DMS.cfg = x; });
  const r2 = (l, ctl) => h('div', { class: 'srow' }, h('label', {}, l), ctl);
  await modal(t('dm_set'), h('div', {}, r2(t('dm_max'), sel([1, 2, 3, 4, 5, 6, 8].map(n => [String(n), String(n)]), String(c.max), v => sv({ max: +v }))), r2(t('dm_conn'), sel([1, 2, 4, 8, 16, 32].map(n => [String(n), String(n)]), String(c.conn), v => sv({ conn: +v }))),
    r2(t('dm_limit'), h('input', { type: 'number', min: 0, value: c.limit, style: 'width:90px', onchange: e => sv({ limit: Math.max(0, +e.target.value || 0) }) })),
    r2(t('dm_dir'), h('button', { onclick: async () => { const f = await api.pick('folder'); if (f && f[0]) { await sv({ dir: f[0] }); toast(f[0]); } } }, '…' + String(c.dir).slice(-26))),
    r2(t('dm_clip'), chk(c.clip, v => sv({ clip: v }))), r2(t('dm_capture'), chk(c.capture, v => sv({ capture: v }))), r2(t('dm_sniff'), chk(c.sniff, v => sv({ sniff: v }))),
    r2(t('dm_sched'), h('span', {}, chk(c.sched.on, v => sv({ sched: { on: v } })), ' ', h('input', { type: 'time', value: c.sched.time, onchange: e => sv({ sched: { time: e.target.value } }) })))), [[t('done'), true, 'pr']]);
}
let dmSig = '';
const dmFiltered = () => { const f = DMS.f; return DMS.jobs.filter(j => f === 'all' || (f === 'active' && j.status === 'downloading') || (f === 'queued' && (j.status === 'queued' || j.status === 'paused')) || (f === 'done' && j.status === 'completed') || (f === 'fail' && j.status === 'error')); };
function dmText(j) {
  const pct = j.size ? Math.min(100, j.got / j.size * 100) : (j.status === 'completed' ? 100 : 0), eta = j.speed && j.size ? (j.size - j.got) / j.speed : 0;
  const st = j.status === 'completed' ? '✓' : j.status === 'error' ? '⚠ ' + (j.error || '') : j.status === 'downloading' ? `${B(j.speed)}/s${eta ? ' · ' + t('dm_eta') + ' ' + fmtT(eta) : ''}` : t('dm_' + j.status);
  return [pct, `${B(j.got)} / ${j.size ? B(j.size) : '?'} · ${Math.round(pct)}% · ${st}`];
}
function dmRow(j) {
  const [pct, txt] = dmText(j), lbl = (ic, tx, fn, cls) => h('button', { class: 'pillb ' + (cls || ''), onclick: fn }, ic + ' ' + tx), bt = (ic, ttl, fn) => h('button', { class: 'rb sm', title: ttl, onclick: fn }, ic);
  const main = j.status === 'downloading' || j.status === 'queued' ? lbl('⏸', t('dm_pause'), () => dmCall('pause', j.id)) : j.status === 'completed' ? lbl('📂', t('dm_open'), () => dmCall('open', j.id), 'pr') : lbl('▶', t('dm_resume'), () => dmCall(j.status === 'error' ? 'retry' : 'resume', j.id), 'pr');
  return h('div', { class: 'dmr', 'data-id': j.id }, h('span', { class: 'dmi' }, DCAT[j.cat] || '📦'),
    h('div', { class: 'dmb' }, h('div', { class: 'nm', title: j.url }, j.name || j.url), h('div', { class: 'bar' }, h('i', { style: `width:${pct}%` })), h('small', { class: 'dmt' }, txt)),
    h('div', { class: 'dma' }, main, bt('🗁', t('dm_folder'), () => dmCall('folder', j.id)), bt('🔗', t('dm_copy'), () => { navigator.clipboard.writeText(j.url).catch(() => {}); toast('✓'); }),
      bt('🗑', t('dm_rm'), e => popMenu(e, [[t('dm_rm'), () => dmCall('remove', j.id)], [t('dm_rmf'), async () => { if (await yes(t('dm_rmf') + '?')) dmCall('removefile', j.id); }]]))));
}
function paintDm() {
  const c = $('#dml'); if (!c) return; const list = dmFiltered(), sig = DMS.f + '|' + list.map(j => j.id + j.status + (j.error || '')).join(',');
  if (sig !== dmSig) { dmSig = sig; c.replaceChildren(...(list.length ? list.map(dmRow) : [h('div', { class: 'empty' }, t('empty'))])); }
  else list.forEach(j => { const r = c.querySelector(`[data-id="${j.id}"]`); if (r) { const [pct, txt] = dmText(j); r.querySelector('.bar i').style.width = pct + '%'; r.querySelector('.dmt').textContent = txt; } });
  const s = $('#dmsum'); if (s) { const sp = DMS.jobs.reduce((a, j) => a + (j.status === 'downloading' ? j.speed || 0 : 0), 0); s.textContent = sp ? '⚡ ' + B(sp) + '/s' : ''; }
}
function dmView() {
  const bar = h('div', { class: 'bar2' }, h('button', { class: 'pr', onclick: dmAddDlg }, '＋ ' + t('dm_add')), h('button', { onclick: () => dmCall('resumeall') }, '▶ ' + t('dm_resumeall')), h('button', { onclick: () => dmCall('pauseall') }, '⏸ ' + t('dm_pauseall')),
    h('button', { onclick: () => dmCall('clear') }, '🧹 ' + t('dm_clear')), h('button', { onclick: dmSettings }, '⚙'), h('span', { id: 'dmsum', class: 'pill' }));
  const chips = [['all', 'f_all'], ['active', 'dm_downloading'], ['queued', 'dm_queued'], ['done', 'dm_completed'], ['fail', 'dm_error']].map(([k, l]) => h('button', { class: 'chip' + (DMS.f === k ? ' on' : ''), onclick: () => { DMS.f = k; render(); } }, t(l)));
  dmSig = ''; setTimeout(paintDm, 0);
  return h('div', {}, bar, h('div', { class: 'bar2' }, chips), h('div', { class: 'card', id: 'dml' }));
}

// ---------- Google sync (Drive appDataFolder) ----------
const GS = { email: '', cid: '', has: false };
const gRefresh = () => api.gStatus().then(s => Object.assign(GS, s));
gRefresh();
function syncPack() {
  return { at: Date.now(), b: { bm: D.b.bm, dial: D.b.dial, sess: D.b.sess, engine: D.b.engine, adblock: D.b.adblock, vt: D.b.vt, dark: D.b.dark, cols: D.b.cols }, weather: { saved: D.weather.saved, loc: D.weather.loc, wu: D.weather.wu, model: D.weather.model },
    look: D.look, s: { lang: D.s.lang, theme: D.s.theme, tf: D.s.tf, webOpen: D.s.webOpen, pcIn: D.s.pcIn, fx: D.s.fx, tzl: D.s.tzl, local: D.s.local }, items: D.items.filter(i => !builtin(i)), cols: D.cols, widths: D.widths, widgets: D.widgets };
}
function syncApply(p) {
  Object.assign(D.b, p.b || {}); Object.assign(D.weather, p.weather || {}); if (p.look) D.look = p.look; Object.assign(D.s, p.s || {});
  if (Array.isArray(p.items)) D.items = [...D.items.filter(builtin), ...p.items]; if (Array.isArray(p.widgets)) D.widgets = p.widgets; if (p.cols) D.cols = p.cols; if (Array.isArray(p.widths)) D.widths = p.widths;
  D.syncAt = p.at; save(); BR.init = 0; render();
}
async function gUp() { const pk = syncPack(), r = await api.gPush(pk); if (r.error) toast(t('g_err') + ': ' + r.error); else { D.syncAt = pk.at; save(); toast('⬆ ' + t('g_done')); } }
async function gDown() { const r = await api.gPull(); if (r.error) toast(t('g_err') + ': ' + r.error); else if (!r.data) toast(t('b_empty')); else if (await yes(t('g_overwrite'))) { syncApply(r.data); toast('⬇ ' + t('g_done')); } }
function gsyncSec() {
  const cid = h('input', { placeholder: t('g_cid'), value: GS.cid || '' }), cs = h('input', { type: 'password', placeholder: t('g_cs') });
  return h('section', { class: 'card' }, h('h3', {}, t('g_title')), h('small', { class: 'mu' }, t('g_hint')),
    GS.has ? h('div', { class: 'frm' }, h('p', {}, '✓ ' + t('g_ok') + ' ' + GS.email), h('div', { class: 'row' }, h('button', { class: 'pr', onclick: gUp }, '⬆ ' + t('g_up')), h('button', { onclick: gDown }, '⬇ ' + t('g_down')), h('button', { onclick: async () => { await api.gOut(); await gRefresh(); render(); } }, t('g_out'))))
      : h('div', { class: 'frm' }, cid, cs, h('button', { class: 'pr', onclick: async () => { toast('…'); const r = await api.gSignin(cid.value.trim(), cs.value.trim()); if (r.error) toast(t('g_err') + ': ' + r.error); else { await gRefresh(); render(); } } }, t('g_in'))));
}

// ---------- analysis tab (smart-money chart + projected path) ----------
const AN = { c: [], an: null, busy: false, err: '', src: '', news: [], sent: { score: 0, b: 0, r: 0, n: 0 }, calAll: null, calAt: 0, newsAt: 0, newsSym: '', htf: 0, iran: null, chart: null, col: false, at: 0 };
const AN_TF = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
const AN_PRE = ['XAUUSD', 'XAGUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'NAS100', 'SPX500', 'US30', 'USOIL', 'DXY', 'IRGOLD18', 'IRCOIN'];
const AN_ALIAS = { 'طلا': 'XAUUSD', 'انس': 'XAUUSD', 'اونس': 'XAUUSD', 'ذهب': 'XAUUSD', 'gold': 'XAUUSD', 'نقره': 'XAGUSD', 'فضة': 'XAGUSD', 'silver': 'XAGUSD', 'بیتکوین': 'BTCUSDT', 'بيتكوين': 'BTCUSDT', 'bitcoin': 'BTCUSDT', 'btc': 'BTCUSDT', 'اتریوم': 'ETHUSDT', 'إيثيريوم': 'ETHUSDT', 'ethereum': 'ETHUSDT', 'eth': 'ETHUSDT', 'نفت': 'USOIL', 'نفط': 'USOIL', 'oil': 'USOIL', 'دلار': 'DXY', 'دولار': 'DXY', 'طلای18': 'IRGOLD18', 'طلاي18': 'IRGOLD18', 'طلایایرانی': 'IRGOLD18', 'سکه': 'IRCOIN', 'سكة': 'IRCOIN', 'سکهامامی': 'IRCOIN' };
const AN_NQ = { XAUUSD: 'gold price', XAGUSD: 'silver price', BTCUSDT: 'bitcoin', ETHUSDT: 'ethereum', SOLUSDT: 'solana', EURUSD: 'EUR USD ECB', GBPUSD: 'GBP USD Bank of England', USDJPY: 'USD JPY Bank of Japan', AUDUSD: 'AUD USD RBA', USDCAD: 'USD CAD Bank of Canada', USOIL: 'crude oil price', NAS100: 'Nasdaq 100', SPX500: 'S&P 500', US30: 'Dow Jones', DXY: 'US dollar index', IRGOLD18: 'gold price', IRCOIN: 'gold price' };
const AN_FIAT = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF'];
function normSym(s) {
  s = String(s || '').trim().replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 1776)).replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));
  const k = s.toLowerCase().replace(/[\s‌]+/g, ''); if (AN_ALIAS[k]) return AN_ALIAS[k]; return s.toUpperCase().replace(/[\s/_-]/g, '');
}
const symCurs = sym => { const c = new Set(); if (/^[A-Z]{6}$/.test(sym)) { if (AN_FIAT.includes(sym.slice(0, 3))) c.add(sym.slice(0, 3)); if (AN_FIAT.includes(sym.slice(3))) c.add(sym.slice(3)); } if (!c.size || /XAU|XAG|BTC|ETH|SOL|OIL|NAS|SPX|US30|DXY|IR/.test(sym)) c.add('USD'); return c; };
const fmtP = v => { const a = Math.abs(v); return v.toFixed(a >= 1000 ? 2 : a >= 10 ? 3 : a >= 1 ? 4 : 6); };
const fmtDur = ms => { const m = Math.round(ms / 60000); return m < 90 ? m + ' min' : m < 2880 ? (m / 60).toFixed(1) + ' h' : (m / 1440).toFixed(1) + ' d'; };
const usdToman = () => (AN.iran && AN.iran.usd) || +D.an.usd || 0;
async function anIranQuotes() {
  const r = await api.mkJson('https://call4.tgju.org/ajax.json'); const cur = r.data && (r.data.current || r.data); if (!cur) { AN.iran = null; return; }
  const v = k => { const o = cur[k]; if (!o) return null; const p = +String(o.p != null ? o.p : o.price != null ? o.price : '').replace(/,/g, ''); return p || null; };
  const usd = v('price_dollar_rl'), q = { usd: usd ? usd / 10 : null, g18: v('geram18') ? v('geram18') / 10 : null, coin: v('sekee') ? v('sekee') / 10 : null, ons: v('ons') };
  AN.iran = q.usd || q.g18 || q.coin ? q : null;
}
async function anAux(sym, force) {
  if (force || AN.newsSym !== sym || Date.now() - AN.newsAt > 6e5) {
    const r = await api.mkText('https://news.google.com/rss/search?q=' + encodeURIComponent((AN_NQ[sym] || sym) + ' when:2d') + '&hl=en-US&gl=US&ceid=US:en'); AN.news = [];
    if (r.data) { try { const x = new DOMParser().parseFromString(r.data, 'text/xml'); AN.news = [...x.querySelectorAll('item')].slice(0, 12).map(i => ({ t: (i.querySelector('title') || {}).textContent || '', u: (i.querySelector('link') || {}).textContent || '' })); } catch {} }
    AN.sent = SENAN.sentiment(AN.news.map(n => n.t)); AN.newsAt = Date.now(); AN.newsSym = sym;
  }
  if (force || !AN.calAll || Date.now() - AN.calAt > 1.8e6) { const r = await api.mkJson('https://nfs.faireconomy.media/ff_calendar_thisweek.json'); if (Array.isArray(r.data)) AN.calAll = r.data.map(e => ({ t: Date.parse(e.date), title: e.title, cur: e.country, imp: e.impact })); AN.calAt = Date.now(); }
}
async function anLoad(quiet) {
  if (AN.busy) return; AN.busy = true; if (!quiet) { AN.err = ''; } paintAn();
  const sym = normSym(D.an.sym), tf = D.an.tf, iran = /^IR(GOLD18|COIN)$/.test(sym), real = iran ? 'XAUUSD' : sym;
  try {
    if (iran) await anIranQuotes();
    const r = await api.mkCandles(real, tf);
    if (r.error || !r.candles || r.candles.length < 60) { AN.err = r.error ? r.error : t('an_few'); AN.busy = false; paintAn(); return; }
    let c = r.candles; AN.src = r.src;
    if (iran) { const u = usdToman(); if (!u) { AN.err = t('an_usd'); AN.busy = false; AN.c = []; paintAn(); return; } const k = sym === 'IRCOIN' ? u / 31.1035 * 7.3197 : u / 31.1035 * .75; c = c.map(x => ({ ...x, o: x.o * k, h: x.h * k, l: x.l * k, c: x.c * k })); }
    const hmap = { '1m': '15m', '5m': '1h', '15m': '4h', '30m': '4h', '1h': '1d', '4h': '1d', '1d': '1w' };
    const [h2] = await Promise.all([api.mkCandles(real, hmap[tf] || '1d'), anAux(sym, !quiet)]);
    AN.htf = h2 && h2.candles ? SENAN.trendOf(h2.candles) : 0;
    const calEv = (AN.calAll || []).filter(e => /High|Medium/i.test(e.imp) && symCurs(sym).has(e.cur) && e.t > Date.now() - 36e5 && e.t < Date.now() + 48 * 36e5).sort((a, b) => a.t - b.t).slice(0, 8);
    AN.calEv = calEv; AN.c = c; AN.at = Date.now(); AN.err = '';
    AN.an = SENAN.analyze(c, { tf, htfTrend: AN.htf, news: AN.sent.score * .8, cal: calEv });
  } catch (e) { AN.err = e.message; }
  AN.busy = false; if (AN.chart && AN.c.length) AN.chart.set(AN.c, AN.an); paintAn();
}
function anSide() {
  const an = AN.an, A = D.an, sym = normSym(A.sym);
  const out = [];
  if (/^IR/.test(sym)) {
    const q = AN.iran; out.push(h('div', { class: 'card' }, h('h3', {}, t('an_iran')), q ? h('div', { class: 'anq' }, q.usd ? h('span', {}, 'USD ' + Math.round(q.usd).toLocaleString(loc())) : null, q.g18 ? h('span', {}, '18k ' + Math.round(q.g18).toLocaleString(loc())) : null, q.coin ? h('span', {}, '🪙 ' + Math.round(q.coin).toLocaleString(loc())) : null) : h('small', { class: 'mu' }, t('an_iran_na')),
      h('div', { class: 'row' }, h('label', {}, t('an_usdl') + ': '), h('input', { type: 'number', min: 0, value: A.usd || '', style: 'width:110px', onchange: e => { A.usd = +e.target.value || 0; save(); AN.c = []; anLoad(); } })), h('small', { class: 'mu' }, t('an_derived'))));
  }
  if (!an) { out.push(h('div', { class: 'card' }, AN.busy ? '…' : (AN.err || t('an_hint')))); return out; }
  const dir = an.dir, lab = dir > 0 ? t('an_bull') : dir < 0 ? t('an_bear') : t('an_neut'), cls = dir > 0 ? 'up' : dir < 0 ? 'dn' : 'nt';
  out.push(h('div', { class: 'card anb ' + cls }, h('div', { class: 'anbig' }, (dir > 0 ? '▲ ' : dir < 0 ? '▼ ' : '◆ ') + lab), h('div', { class: 'bar' }, h('i', { style: `width:${an.conf}%` })),
    h('small', {}, `${t('an_conf')}: ${an.conf}% · ${t('an_horizon')}: ~${fmtDur(an.horizon * an.step)} · ${an.session}`), h('div', { class: 'anwhy' }, an.comps.map(c => h('span', { class: 'chip ' + (c.v > 0 ? 'upc' : 'dnc') }, (c.v > 0 ? '+' : '') + c.v.toFixed(1) + ' ' + c.txt)))));
  const p = an.plan;
  out.push(h('div', { class: 'card' }, h('h3', {}, t('an_plan')), p ? h('div', { class: 'anq' }, h('span', {}, `${t('an_entry')} ${fmtP(p.entry)} (${p.zone})`), h('span', { class: 'dnt' }, `SL ${fmtP(p.sl)}`), h('span', { class: 'upt' }, `TP1 ${fmtP(p.tp1)} · RR ${p.rr1.toFixed(1)}`), h('span', { class: 'upt' }, `TP2 ${fmtP(p.tp2)} · RR ${p.rr2.toFixed(1)}`)) : h('small', {}, t('an_nosetup')),
    p && p.wait ? h('small', { class: 'mu' }, t('an_wait')) : null, p && p.rr1 < 1.5 ? h('small', { class: 'dnt' }, ' RR < 1.5') : null));
  out.push(h('div', { class: 'card' }, h('h3', {}, t('an_wicks')), h('div', { class: 'anq' }, an.wicks.map(w => h('span', {}, `${w.side > 0 ? '▲' : '▼'} ${fmtP(w.lvl)} (${w.kind}) ~${w.p}%`))), h('small', { class: 'mu' }, `${t('an_sweepf')}: ${Math.round(an.sweepFreq * 100)}%`)));
  out.push(h('div', { class: 'card' }, h('h3', {}, t('an_bt')), h('div', {}, an.bt.acc == null ? '—' : `${Math.round(an.bt.acc * 100)}% (n=${an.bt.n}) · ${t('an_vs')} ${Math.round(an.bt.base * 100)}%`), h('small', { class: 'mu' }, t('an_btnote'))));
  out.push(h('div', { class: 'card' }, h('h3', {}, t('an_cal')), (AN.calEv || []).length ? AN.calEv.map(e => h('div', { class: 'ane' + (Math.abs(e.t - Date.now()) < 36e5 ? ' hot' : '') }, h('b', {}, e.cur), ' ', fmtc({ weekday: 'short', hour: '2-digit', minute: '2-digit' }, tzv()).format(e.t), ' · ', e.title)) : h('small', { class: 'mu' }, '—')));
  const sn = AN.sent; out.push(h('div', { class: 'card' }, h('h3', {}, t('an_news')), h('small', {}, `${t('an_sent')}: ${sn.n ? (sn.score > .15 ? '▲ ' : sn.score < -.15 ? '▼ ' : '◆ ') + `+${sn.b}/-${sn.r}` : '—'}`), AN.news.slice(0, 8).map(n => h('div', { class: 'pi', onclick: () => openWeb(n.u), title: n.u }, h('span', { class: 'nm' }, n.t)))));
  out.push(h('small', { class: 'mu' }, `${t('an_src')}: ${AN.src}`));
  return out;
}
function paintAn() {
  const s = $('#anside'); if (s) s.replaceChildren(...anSide());
  const st = $('#anst'); if (st) st.textContent = AN.busy ? '…' : AN.at ? `${AN.src} · ${fmtc({ timeStyle: 'medium' }, tzv()).format(AN.at)}` : '';
}
function anView() {
  const A = D.an, symIn = h('input', { list: 'anlist', value: A.sym, placeholder: t('an_sym'), style: 'width:150px', onkeydown: e => { if (e.key === 'Enter') { A.sym = e.target.value.trim() || A.sym; save(); AN.c = []; AN.an = null; anLoad(); } } });
  const reload = () => { A.sym = symIn.value.trim() || A.sym; save(); AN.c = []; AN.an = null; anLoad(); };
  const OVS = [['ob', 'OB'], ['fvg', 'FVG'], ['liq', t('an_o_liq')], ['str', t('an_o_str')], ['zone', t('an_o_zone')], ['fc', t('an_o_fc')], ['wick', t('an_o_wick')], ['plan', t('an_o_plan')]];
  const cv = h('canvas', { class: 'anc' });
  AN.chart = SENAN.chart(cv, { fmt: x => fmtc({ month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }, tzv()).format(x), onHover: c => { const e = $('#anhov'); if (e) e.textContent = `${fmtc({ dateStyle: 'medium', timeStyle: 'short' }, tzv()).format(c.t)}  O ${fmtP(c.o)}  H ${fmtP(c.h)}  L ${fmtP(c.l)}  C ${fmtP(c.c)}`; } });
  AN.chart.setColors(A.colors); AN.chart.setOv(A.ov); if (AN.c.length) AN.chart.set(AN.c, AN.an);
  if (!AN.c.length && !AN.busy && !AN.err) setTimeout(() => anLoad(), 0);
  const colors = AN.col ? h('div', { class: 'bar2 cpg2' }, [['bg', 'c_bg'], ['up', 'an_c_up'], ['dn', 'an_c_dn'], ['grid', 'an_c_grid'], ['tx', 'c_tx']].map(([k, l]) => h('label', { class: 'cpk' }, t(l), h('input', { type: 'color', value: A.colors[k], oninput: e => { A.colors[k] = e.target.value; AN.chart.setColors(A.colors); save(); } }))),
    h('button', { onclick: () => { A.colors = { bg: '#000000', up: '#00c853', dn: '#ff1744', grid: '#141414', tx: '#8a8f98' }; save(); render(); } }, t('an_reset'))) : null;
  return h('div', { class: 'anpage' }, h('div', { class: 'anwarn' }, t('an_warn')),
    h('div', { class: 'bar2' }, symIn, h('datalist', { id: 'anlist' }, AN_PRE.map(p => h('option', { value: p }))), h('button', { class: 'pr', onclick: reload }, t('an_load')),
      AN_TF.map(x => h('button', { class: 'chip' + (A.tf === x ? ' on' : ''), onclick: () => { A.tf = x; save(); AN.c = []; AN.an = null; AN.err = ''; render(); } }, x)),
      h('button', { title: t('an_auto'), class: A.auto ? 'on' : '', onclick: () => { A.auto = !A.auto; save(); render(); } }, '⟳ ' + (A.auto ? '60s' : '—')), h('button', { onclick: () => { AN.col = !AN.col; render(); } }, '🎨'), h('span', { id: 'anst', class: 'pill' })),
    h('div', { class: 'bar2' }, OVS.map(([k, l]) => h('button', { class: 'chip' + (A.ov[k] ? ' on' : ''), onclick: () => { A.ov[k] = A.ov[k] ? 0 : 1; save(); render(); } }, l))), colors,
    h('div', { class: 'anrow' }, h('div', { class: 'anmain' }, h('div', { id: 'anhov', class: 'anhov' }, t('an_hint')), cv), h('div', { id: 'anside', class: 'anside' }, anSide())),
    h('div', { class: 'anwarn small' }, t('an_warn')));
}
setInterval(() => { if (tab === 'analysis' && !document.hidden && D.an.auto && !AN.busy) anLoad(true); }, 60000);

// ---------- power saving ----------
const BATT = { low: false }; let ecoLast = null;
const ecoOn = () => D.s.eco === 'on' || (D.s.eco === 'auto' && BATT.low);
function applyEco() { const on = ecoOn(); window.SEN_ECO = on; document.documentElement.classList.toggle('eco', on); if (on !== ecoLast) { ecoLast = on; api.monCfg(D.s.interval * 1000 * (on ? 2 : 1), D.s.sensors); } }
if (navigator.getBattery) navigator.getBattery().then(b => { const u = () => { BATT.low = !b.charging && b.level < .5; applyEco(); }; b.addEventListener('chargingchange', u); b.addEventListener('levelchange', u); u(); }).catch(() => {});
function defAppsSec() { return h('section', { class: 'card' }, h('h3', {}, t('defapps')), h('p', { class: 'mu' }, t('defapps_txt')), h('button', { class: 'pr', onclick: () => api.openDefaults() }, t('defapps_btn'))); }
api.onOpen(r => {
  if (r.url) { openWeb(r.url); return; } const lo = String(r.file || '').toLowerCase();
  if (MEXT.video.some(e => lo.endsWith(e))) { tab = 'video'; addMedia('video', [r.file]); render(); } else if (MEXT.music.some(e => lo.endsWith(e))) { tab = 'music'; addMedia('music', [r.file]); render(); } else api.launch({ type: 'app', id: '', path: r.file });
});

// ---------- shell ----------
const mq = matchMedia('(prefers-color-scheme: dark)');
const TABS = [['home', '🏠'], ['apps', '🗂️'], ['games', '🎮'], ['folders', '📁'], ['favs', '⭐'], ['video', '🎬'], ['music', '🎵'], ['browser', '🌐'], ['downloads', '⬇️'], ['weather', '⛅'], ['analysis', '📈'], ['monitor', '📊'], ['look', '🎨'], ['settings', '⚙️']];
const LOGO = '<svg width="30" height="30" viewBox="0 0 256 256"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b6cff"/><stop offset="1" stop-color="#a046ff"/></linearGradient></defs><rect x="8" y="8" width="240" height="240" rx="56" fill="url(#g)"/><g fill="#fff"><rect x="64" y="64" width="56" height="56" rx="14"/><rect x="136" y="64" width="56" height="56" rx="14"/><rect x="64" y="136" width="56" height="56" rx="14"/><rect x="136" y="136" width="56" height="56" rx="14" opacity=".6"/></g></svg>';
function render() {
  const vs = MP.video.el, was = vs && !vs.paused && !vs.ended;
  closeMenu(); const rtl = D.s.lang !== 'en', root = document.documentElement;
  root.lang = D.s.lang; root.dir = rtl ? 'rtl' : 'ltr'; root.dataset.t = D.s.theme === 'system' ? (mq.matches ? 'dark' : 'light') : D.s.theme; applyLook(); applyEco();
  const main = h('main', { class: tab === 'browser' ? 'br' : '' }, tab === 'home' ? home() : tab === 'settings' ? settings() : tab === 'monitor' ? h('div', { class: 'mgrid', id: 'mtab' }) : (tab === 'video' || tab === 'music') ? mediaView(tab) : tab === 'browser' ? brView() : tab === 'downloads' ? dmView() : tab === 'weather' ? weatherView() : tab === 'analysis' ? anView() : tab === 'look' ? lookView() : listTab());
  $('#app').replaceChildren(
    h('header', {}, h('div', { class: 'logo', html: LOGO + '<b>SEN Launcher</b>' }), h('div', { class: 'sp' }), h('div', { id: 'chips', class: 'chips', onclick: () => { monOpen = !monOpen; render(); } }),
      h('div', { id: 'clk', class: 'clk', onclick: clockDlg }), sel([['en', 'English'], ['fa', 'فارسی'], ['ar', 'العربية']], D.s.lang, v => { D.s.lang = v; save(); render(); }),
      monOpen ? h('div', { id: 'mpanel', class: 'mpanel' }) : null),
    h('nav', { class: D.s.sb ? '' : 'mini' }, h('button', { onclick: () => { D.s.sb = !D.s.sb; save(); render(); } }, '☰'),
      TABS.map(([k, ic]) => h('button', { class: tab === k ? 'on' : '', onclick: () => { tab = k; q = ''; render(); } }, ic, h('span', { class: 'l' }, t(k))))), main);
  if (vs) { if (tab !== 'video') { if (!vs.paused) vs.pause(); } else if (was && vs.paused) vs.play().catch(() => {}); }
  tickClock(); paintMon();
  if (tab === 'browser') { if (!BR.init) { BR.init = 1; initBr(); } paintBr(); } placeBrowser();
  if (tab === 'weather') wxEnter();
}

// ---------- start ----------
mq.onchange = () => render();
boot = await api.boot();
const saved = await api.load(); applyLoaded(saved || {});
if (!saved) save();
api.prefs(D.s); api.monCfg(D.s.interval * 1000, D.s.sensors); api.adblock(D.b.adblock);
api.monStatic().then(i => { monInfo = i || {}; paintMon(); });
api.onMon(m => { mon = m; paintMon(); });
setInterval(tickClock, 1000);
addEventListener('focus', async () => { boot = await api.boot(); if (tab === 'home') render(); });
render(); applyEco(); api.appReady();
api.apps().then(async () => { boot = await api.boot(); render(); });
})();
