set -o errexit

pip install -r django_requirements.txt

python manage.py collectstatic --no-input

