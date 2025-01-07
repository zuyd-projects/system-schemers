import os
import graphviz

def generate_class_diagram(classes, output_path='diagram_output/class_diagram'):
    """
    Genereert een class diagram op basis van de ontvangen klassen en relaties.

    Args:
        classes (list of dict): Een lijst met klassen. Elke klasse wordt beschreven door een dict met:
            - "name" (str): Naam van de klasse.
            - "fields" (list of str): Veldnamen in de klasse.
            - "methods" (list of str): Methodes van de klasse.
            - "relations" (list of dict): Relaties naar andere klassen (optioneel).
        output_path (str): Pad waar het diagram wordt opgeslagen (zonder extensie).
    """
    # Zorg dat de output directory bestaat
    output_dir = os.path.dirname(output_path)
    os.makedirs(output_dir, exist_ok=True)

    # Initialiseer Graphviz Digraph
    dot = graphviz.Digraph(comment='Class Diagram', format='png')

    # Voeg klassen toe
    for cls in classes:
        class_label = f"<<TABLE BORDER='1' CELLBORDER='0' CELLSPACING='0'>"
        class_label += f"<TR><TD BGCOLOR='lightblue'><B>{cls['name']}</B></TD></TR>"

        # Voeg velden toe
        if 'fields' in cls and cls['fields']:
            for field in cls['fields']:
                class_label += f"<TR><TD ALIGN='LEFT'>{field}</TD></TR>"

        # Voeg methodes toe
        if 'methods' in cls and cls['methods']:
            for method in cls['methods']:
                class_label += f"<TR><TD ALIGN='LEFT'><I>{method}()</I></TD></TR>"

        class_label += "</TABLE>>"

        dot.node(cls['name'], label=class_label, shape='none')

        # Voeg relaties toe
        if 'relations' in cls and cls['relations']:
            for relation in cls['relations']:
                dot.edge(cls['name'], relation['target'], label=relation.get('type', ''))

    # Sla het diagram op
    dot.render(output_path, cleanup=True)
    print(f"Class diagram gegenereerd en opgeslagen als {output_path}.png")