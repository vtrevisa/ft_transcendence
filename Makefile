SNAME=mysite

all: update install python $(SNAME) run
	
update:
	sudo apt-get update

install:
	sudo apt install python3 python3-pip python3-venv
	sudo apt install python3-django

python:
	python3 -m venv tenv
	. tenv/bin/activate
	pip install django

$(SNAME):
	django-admin startproject $(SNAME)

run:
	python3 ./mysite/manage.py runserver