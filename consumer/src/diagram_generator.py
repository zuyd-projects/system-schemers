import os
import graphviz

def generate_class_diagram(classes, output_path='diagram_output/class_diagram'):
    """
        Generates a class diagram based on the received classes and their relationships.

        Args:
            classes (list of dict): A list of classes. Each class is described by a dictionary with:
                - "name" (str): The name of the class. (Make sure it is in English and use CamelCase)
                - "fields" (list of str): The fields in the class. (Make sure it is in English and use CamelCase)
                - "methods" (list of str): The methods in the class. (Make sure it is in English and use CamelCase)
                - "relations" (list of dict): Relationships to other classes (optional). (Make sure it is in English and use CamelCase)
            output_path (str): The path where the diagram will be saved (without extension).
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