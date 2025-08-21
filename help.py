from flask import Flask, render_template, request

app = Flask(__name__)

# Dummy FAQ data
faq_data = [
    {'question': 'What is Krushi?', 'answer': 'Krushi is a Public Charitable Trust...'},
    {'question': 'How does it work?', 'answer': 'Lorem ipsum dolor sit amet consectetur...'},
    {'question': 'How can I invite a team member?', 'answer': 'Lorem ipsum dolor sit amet consectetur...'},
    {'question': 'How does Krushi address challenges?', 'answer': 'Lorem ipsum dolor sit amet consectetur...'},
    {'question': 'How can I be a part of Krushi?', 'answer': 'Lorem ipsum dolor sit amet consectetur...'},
]

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/')
def index():
    return render_template('index.html', faq_data=faq_data)

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query', '')
    results = []

    for faq in faq_data:
        if query.lower() in faq['question'].lower():
            results.append(faq)

    return render_template('search_results.html', results=results, query=query)

if __name__ == '__main__':
    app.run(debug=True)
