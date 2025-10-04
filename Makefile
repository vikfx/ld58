.PHONY: help wpchmod installwp wpoptions spiralimmo spiralscreen spiraldivi divipluginlist diviplugininstall spiralpluginlist spiralplugininstall miscpluginlist miscplugininstall baseplugin basetheme deploy dbdeploy logs backup

.DEFAULT_GOAL = help

title = title
devpwd = devpwd
dbprefix = spi_
blogdesc = une création Spiral
plugin = plugin
theme = theme
temp = temp

include .env

help: ## help			Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

wpchmod: ## wpchmod			changer les droits des fichiers en 660 et les dossiers en 770 (mode dev)
	chown -R spiralftp:www-data ./
	find ./ -type d -exec chmod 770 {} \;
	find ./ -type f -exec chmod 660 {} \;
	chown spiraldev:spiral ./.env
	chmod 600 ./.env
	chown spiraldev:spiral ./Makefile
	chmod 760 ./Makefile
	chmod 660 ./wp-config.php

installwp: ## installwp		site title devpwd dbprefix | installer wordpress (prefix avec _)
	wp core download --locale=fr_FR
	wp config create --dbname="$(dbname)" --dbuser="$(dbuser)" --dbpass="$(dbpwd)" --dbhost="$(dbhost)" --dbprefix="$(dbprefix)" --locale=fr_FR
	wp config set DISALLOW_FILE_EDIT true
	wp core install --url="$(site).spiral-serveur.fr" --title='$(title)' --admin_user="SpiralDev" --admin_password='$(devpwd)' --admin_email="victorien@spiral-communication.fr"
	
spiraldivi: ## spiraldivi		installer le theme divi & creer un theme enfant vierge pour divi
	cp -r /home/spiraldev/Lab/Tools/WP/themes/elegant/Divi wp-content/themes/Divi
	cp -r /home/spiraldev/Lab/Tools/Models/themes/spiral-divi wp-content/themes/spiral-divi
	wp theme activate spiral-divi
	sudo make wpchmod

spiralimmo: ## spiralimmo		installer les plugins et le theme pour une vitrine immo
	cp -r /home/spiraldev/Lab/Tools/WP/immo/themes/spiralborneimmo wp-content/themes/spiralborneimmo
	cp -r /home/spiraldev/Lab/Tools/WP/immo/plugins/spiralimmo wp-content/plugins/spiralimmo
	cp -r /home/spiraldev/Lab/Tools/WP/immo/plugins/spiral-simple-slideshow wp-content/plugins/spiral-simple-slideshow
	cp -r /home/spiraldev/Lab/Tools/WP/immo/.htaccess_immo .htaccess
	make wpoptions
	wp post delete 1 --force
	wp post delete 2 --force
	wp post delete 3 --force
	wp plugin install contact-form-7
	wp language plugin install contact-form-7 fr_FR
	wp plugin activate contact-form-7
	wp plugin install jwt-authentication-for-wp-rest-api --activate
	wp config shuffle-salts JWT_AUTH_SECRET_KEY --force
	wp config set JWT_AUTH_CORS_ENABLE true --raw
	wp config set DISABLE_WP_CRON true --raw
	wp plugin install duplicator
	wp plugin activate spiralimmo
	wp plugin activate spiral-simple-slideshow
	wp theme activate spiralborneimmo
	sudo make wpchmod

spiralscreen: ## spiralscreen		installer les plugins et le theme pour un affichage dynamique
	cp -r /home/spiraldev/Lab/Tools/WP/themes/spiral/spiral-screen wp-content/themes/spiral-screen
	cp -r /home/spiraldev/Lab/Tools/WP/plugins/spiral/spiral-simple-slideshow wp-content/plugins/spiral-simple-slideshow
	make wpoptions
	wp post delete 1 --force
	wp post delete 2 --force
	wp post delete 3 --force
	wp config shuffle-salts JWT_AUTH_SECRET_KEY --force
	wp plugin install duplicator
	wp plugin activate spiral-simple-slideshow
	wp theme activate spiral-screen
	sudo make wpchmod

baseplugin: ## baseplugin		plugin | installer les fichiers de base pour la création d'un nouveau plugin
	cp -r /home/spiraldev/Lab/Tools/Models/plugins/spiral-base-plugin wp-content/plugins/$(plugin)
	mv wp-content/plugins/$(plugin)/spiral-base-plugin.php wp-content/plugins/$(plugin)/$(plugin).php
	sudo make wpchmod

basetheme: ## basetheme		theme | installer les fichiers de base pour la création d'un nouveau theme
	cp -r /home/spiraldev/Lab/Tools/Models/themes/spiralreigns wp-content/themes/$(theme)
	vim wp-content/themes/$(theme)/style.css
	sudo make wpchmod

divipluginlist: ## divipluginlist		liste des plugins divi
	ls /home/spiraldev/Lab/Tools/WP/plugins/elegant

diviplugininstall: ## diviplugininstall	plugin | installer le module divi $plugin 
	cp -r /home/spiraldev/Lab/Tools/WP/plugins/elegant/$(plugin) wp-content/plugins/$(plugin)
	sudo make wpchmod
	wp plugin activate $(plugin)

spiralpluginlist: ## spiralpluginlist		liste des plugins divi
	ls /home/spiraldev/Lab/Tools/WP/plugins/spiral

spiralplugininstall: ## spiralplugininstall	plugin | installer le module spiral $plugin 
	cp -r /home/spiraldev/Lab/Tools/WP/plugins/spiral/$(plugin) wp-content/plugins/$(plugin)
	sudo make wpchmod
	wp plugin activate $(plugin)

miscpluginlist: ## miscpluginlist		liste des plugins tiers
	ls /home/spiraldev/Lab/Tools/WP/plugins/misc

miscplugininstall: ## miscplugininstall	plugin | installer le module tiers $plugin 
	cp -r /home/spiraldev/Lab/Tools/WP/plugins/misc/$(plugin) wp-content/plugins/$(plugin)
	sudo make wpchmod
	wp plugin activate $(plugin)

wpoptions: ## wpoptions		blogdesc | regler les options par defaut de wordpress
	wp option update blogdescription "$(blogdesc)"
	wp option update blog_public 0
	wp option update default_pingback_flag 1
	wp option update default_ping_status closed
	wp option update default_comment_status closed
	wp option update require_name_email 1
	wp option update comment_registration 1
	wp option update close_comments_for_old_posts 1
	wp option update close_comments_days_old 1
	wp option update show_comments_cookies_opt_in 0
	wp option update thread_comments 0
	wp option update page_comments 0
	wp option update comments_notify 1
	wp option update moderation_notify 1
	wp option update comment_moderation 1
	wp option update comment_whitelist 1
	wp option update comment_max_links 0
	wp option update show_avatars 0
	wp rewrite structure "/%postname%/"
	wp rewrite flush

deploy: ## deploy			ssh path ddbname ddbuser ddbpass | (non testé) Déploie une nouvelle version de l'application sur le serveur le path doit comporter un / final
	rsync -av ./ $(ssh):$(path) \
	--exclude Makefile \
	--exclude .env \
	--exclude wp-config.php
	ssh $(ssh) "cd $(path); php wp-cli.phar config create --dbname=$(ddbname) --dbuser=$(ddbuser) --dbpass=$(ddbpass) --dbprefix=$(dbprefix) --locale=fr_FR"

dbdeploy: ## dbdeploy			(non testé) deployer la bdd
	wp db export --add-drop-table dump.sql
	rsync -av ./dump.sql $(ssh):$(path)
	ssh $(ssh) "cd $(path); php wp-cli.phar db import dump.sql; php wp-cli.phar search-replace '$(site).spiral-serveur.fr' '$(domain)';rm dump.sql"
	rm dump.sql

logs: ## logs		 	voir les logs du site
	tail -n 10 -f /var/log/spiral/$(site).log

backup: ## backup			envoyer un backup dans le dossier ../Sites/backup/site_%Y-%M-%J.zip
	wp db export bdd.sql
	zip -qr backup-temp.zip ./
	chown spiraldev:spiral backup-temp.zip
	chmod 600 backup-temp.zip
	mv backup-temp.zip "/home/spiralftp/Sites/backup/$(site)-$$(date +"%Y-%m-%d_%H-%M").zip"
	rm bdd.sql
