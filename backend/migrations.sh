python manage.py makemigrations
python manage.py migrate
python manage.py shell < tools/create_superuser.py
python manage.py collectstatic --noinput

python manage.py delete_dummy_data
python manage.py create_dummy_data