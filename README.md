# EmailTracker

Trovare una piataforma hosting con un server web che espone immagini e un back end che le fornisce

il backend deve fornire un endpoint che se chiamato generi un file di testo chiamato timestamp_destinatario
(che si trova nella richesta nel body o come query param)

deve creare delle risorse che attinggono tutte alla stessa risorsa (pixel trasparente) di timpo immagine con un nome random , mappato con il file creato 1 a 1

quando viene richesta la risorsa salvo il timestamp e la posizizione dell ip

