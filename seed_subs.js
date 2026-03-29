const { SubCategory } = require('./backend/models');
(async () => {
    try {
        const subs = ['Medical Equipment', 'Industrial Machines', 'Office Electronics', 'Printing & Branding', 'Construction Equipment', 'Other'];
        for (const s of subs) {
            await SubCategory.findOrCreate({
                where: { name: s, category_id: 20 },
                defaults: { name: s, category_id: 20 }
            });
        }
        console.log('Subcategories seeded for Commercial Equipment (ID 20)');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit(0);
    }
})();
