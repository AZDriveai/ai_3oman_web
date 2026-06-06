import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">سياسة الخصوصية</h1>
          <p className="text-muted-foreground mb-8">
            آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
          </p>

          <div className="space-y-8 text-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. مقدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحن في منصة ai_3oman نلتزم بحماية خصوصيتك. تشرح هذه السياسة كيفية جمع واستخدام وحماية بيانات شخصية عند استخدام منصتنا.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. البيانات التي نجمعها</h2>
              <p className="text-muted-foreground leading-relaxed">
                قد نجمع المعلومات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>معلومات الملف الشخصي (الاسم والبريد الإلكتروني)</li>
                <li>محتوى المحادثات والرسائل</li>
                <li>بيانات الاستخدام والتفاعل مع المنصة</li>
                <li>عنوان IP والمعلومات الجغرافية</li>
                <li>معلومات جهازك والمتصفح</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. كيفية استخدام البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نستخدم البيانات المجمعة للأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>توفير وتحسين الخدمات</li>
                <li>تخصيص تجربة المستخدم</li>
                <li>الاتصال بك بشأن التحديثات والعروض</li>
                <li>تحليل الاستخدام وتحسين الأداء</li>
                <li>الامتثال للمتطلبات القانونية</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. حماية البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نتخذ إجراءات أمنية مناسبة لحماية بيانات شخصية من الوصول غير المصرح به أو التعديل أو الحذف. ومع ذلك، لا يمكننا ضمان أمان كامل لأي معلومات مرسلة عبر الإنترنت.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. مشاركة البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                لن نشارك بيانات شخصية مع أطراف ثالثة بدون موافقتك، إلا في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>عندما يكون ذلك مطلوباً بموجب القانون</li>
                <li>لحماية حقوقنا أو سلامتنا</li>
                <li>مع مزودي الخدمات الذين يساعدوننا في تشغيل المنصة</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. حقوقك</h2>
              <p className="text-muted-foreground leading-relaxed">
                لديك الحق في:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>الوصول إلى بيانات شخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>حذف بيانات شخصية</li>
                <li>الاعتراض على معالجة البيانات</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. ملفات تعريف الارتباط</h2>
              <p className="text-muted-foreground leading-relaxed">
                تستخدم منصتنا ملفات تعريف الارتباط لتحسين تجربة المستخدم. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. التغييرات على السياسة</h2>
              <p className="text-muted-foreground leading-relaxed">
                قد نحدث هذه السياسة من وقت لآخر. سيتم إخطارك بأي تغييرات جوهرية عن طريق البريد الإلكتروني أو إشعار بارز على المنصة.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. الاتصال بنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى الاتصال بنا على:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>البريد الإلكتروني: wolfonlyoman@gmail.com</li>
                <li>الهاتف: +96872424324</li>
                <li>تيليجرام: @a3b6iii</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">10. الامتثال القانوني</h2>
              <p className="text-muted-foreground leading-relaxed">
                تمتثل سياسة الخصوصية هذه للقوانين واللوائح المعمول بها في سلطنة عمان وتتعامل مع البيانات الشخصية بمسؤولية وشفافية.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
