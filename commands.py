from app import create_app, db
from app.models import ProductCategory, ProductSubcategory, ServiceCategory, ServiceSubcategory

app = create_app()
app.app_context().push()

def populate_categories_and_subcategories():
    product_categories = {
        'Electronics': ['Computers', 'Televisions', 'Cameras and Photos', 'Cell Phones and Smartphones', 'Electronic Accessories'],
        'Home and Garden': ['Furniture', 'Appliances', 'Home Decor', 'Gardening', 'Home Improvements'],
        'Clothing and Accessories': ['Women\'s Clothing', 'Men\'s Clothing', 'Shoes', 'Accessories', 'Children\'s Clothing'],
        'Health and Beauty': ['Skin Care Products', 'Makeup', 'Perfumes and Fragrances', 'Hair Care', 'Health'],
        'Automotive': ['Vehicle Parts and Accessories', 'Automotive Tools and Equipment', 'Automotive Electronics'],
        'Books, Music and Movies': ['Books and Ebooks', 'Music', 'Movies and Series', 'Musical Instruments'],
        'Sports and Fitness': ['Sports Equipment and Accessories', 'Sportswear and Athletic Shoes', 'Fitness Equipment'],
        'Toys and Games': ['Toys', 'Games', 'Video Games and Consoles', 'Educational Toys'],
        'Babies and Children': ['Baby and Children Clothing', 'Baby and Children Furniture and Decor', 'Baby and Children Toys'],
        'Food and Drinks': ['Grocery', 'Alcoholic Beverages', 'Non-Alcoholic Beverages', 'Gourmet Products', 'Healthy Foods'],
        'Jewelry and Watches': ['Jewelry', 'Watches', 'Fashion Accessories'],
        'Travel': ['Luggage and Travel Accessories', 'Travel Accessories', 'Travel Packages'],
        'Business and Industrial': ['Office Equipment', 'Construction Materials', 'Industrial Equipment'],
        'Art and Entertainment': ['Art', 'Entertainment Memorabilia', 'Party Supplies'],
        'Animals and Pet Shop': ['Pet Food and Supplies', 'Pet Accessories', 'Pet Medications'],
        'Other': ['Other']
    }

    service_categories = {
        'Consulting': ['Business Consulting', 'IT Consulting', 'Legal Consulting'],
        'Healthcare': ['General Practitioner', 'Dentist', 'Physiotherapy', 'Psychology'],
        'Education': ['Tutoring', 'Language Learning', 'Coding Bootcamps', 'Art Classes'],
        'Financial Services': ['Accounting', 'Financial Advising', 'Tax Preparation'],
        'Real Estate': ['Buying & Selling', 'Rentals', 'Property Management'],
        'Food & Beverages': ['Catering', 'Meal Delivery', 'Personal Chef'],
        'Events & Entertainment': ['Event Planning', 'DJ Services', 'Wedding Planning'],
        'Travel & Tourism': ['Travel Agency', 'Tour Guiding', 'Accommodation Services'],
        'Automotive Services': ['Car Repair', 'Car Wash', 'Tire Services', 'Oil Change'],
        'Beauty & Wellness': ['Hairdressing', 'Massage Therapy', 'Spa Services'],
        'Sports & Recreation': ['Personal Training', 'Sports Coaching', 'Yoga Classes'],
        'Home Services': ['Cleaning', 'Landscaping', 'Home Repair', 'Pest Control'],
        'IT & Electronics': ['Computer Repair', 'Data Recovery', 'Mobile Phone Repair'],
        'Marketing & Advertising': ['SEO Services', 'Social Media Marketing', 'Content Creation'],
        'Transportation & Logistics': ['Courier Services', 'Moving Services', 'Storage Services'],
        'Other': ['Other']
    }

    for category, subcategories in product_categories.items():
        cat = ProductCategory(name=category)
        db.session.add(cat)
        db.session.commit()
        for subcategory in subcategories:
            sub = ProductSubcategory(name=subcategory, category_id=cat.id)
            db.session.add(sub)
        db.session.commit()

    for category, subcategories in service_categories.items():
        cat = ServiceCategory(name=category)
        db.session.add(cat)
        db.session.commit()
        for subcategory in subcategories:
            sub = ServiceSubcategory(name=subcategory, category_id=cat.id)
            db.session.add(sub)
        db.session.commit()

if __name__ == '__main__':
    print("Populando categorias e subcategorias de produtos e serviços...")
    populate_categories_and_subcategories()
    print("População concluída com sucesso!")
