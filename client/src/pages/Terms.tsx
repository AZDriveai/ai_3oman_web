import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 p-4 lg:p-8 mt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">الشروط والأحكام</h1>
          <p className="text-muted-foreground mb-8">
            آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
          </p>

          <div className="space-y-8 text-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">1. قبول الشروط</h2>
              <p className="text-muted-foreground leading-relaxed">
                بالوصول إلى واستخدام منصة ai_3oman، فإنك توافق على الالتزام بهذه الشروط والأحكام وجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، فيُرجى عدم استخدام هذه المنصة.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">2. استخدام الخدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                توافق على استخدام منصة ai_3oman فقط للأغراض القانونية وبطريقة لا تنتهك حقوق الآخرين أو تقيد استخدامهم للمنصة. السلوك المحظور يشمل:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>المضايقة أو الإساءة إلى الآخرين</li>
                <li>نشر محتوى غير قانوني أو مسيء</li>
                <li>محاولة الوصول غير المصرح به إلى أنظمتنا</li>
                <li>نقل الفيروسات أو البرامج الضارة</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">3. حقوق الملكية الفكرية</h2>
              <p className="text-muted-foreground leading-relaxed">
                جميع المحتوى على منصة ai_3oman، بما في ذلك النصوص والرسومات والشعارات والصور والبرامج، محمي بموجب قوانين الملكية الفكرية. لا يُسمح بنسخ أو توزيع أي محتوى بدون إذن صريح.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">4. حسابات المستخدم</h2>
              <p className="text-muted-foreground leading-relaxed">
                أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تحدث تحت حسابك. توافق على إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">5. تحديد المسؤولية</h2>
              <p className="text-muted-foreground leading-relaxed">
                في أقصى حد يسمح به القانون، لن تكون منصة ai_3oman مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية ناشئة عن استخدام أو عدم القدرة على استخدام المنصة.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">6. التعديلات على الخدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحتفظ بالحق في تعديل أو إيقاف الخدمة أو أي جزء منها في أي وقت وبدون إشعار مسبق. لن نكون مسؤولين عن أي خسائر ناجمة عن هذه التعديلات.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">7. الإنهاء</h2>
              <p className="text-muted-foreground leading-relaxed">
                يمكننا إنهاء أو تعليق حسابك في أي وقت، لأي سبب أو بدون سبب، بما في ذلك انتهاك هذه الشروط والأحكام.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">8. القانون الحاكم</h2>
              <p className="text-muted-foreground leading-relaxed">
                تحكم هذه الشروط والأحكام وتفسر وفقاً لقوانين سلطنة عمان، دون الاعتبار لتضاربات أحكام القانون.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold">9. الاتصال بنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا على:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>البريد الإلكتروني: wolfonlyoman@gmail.com</li>
                <li>الهاتف: +96872424324</li>
                <li>تيليجرام: @a3b6iii</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
