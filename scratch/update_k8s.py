import yaml
import sys

with open('k8s/deployment.yaml', 'r') as f:
    docs = list(yaml.safe_load_all(f))

java_services = [
    "config-server", "eureka-server", "user-service", "order-service", 
    "portfolio-service", "market-data", "api-gateway", "notification-service", "risk-service"
]

for doc in docs:
    if doc and doc.get('kind') == 'Deployment':
        metadata = doc.get('metadata', {})
        name = metadata.get('name')
        
        # 1. Update Image Names
        spec = doc.get('spec', {})
        template = spec.get('template', {})
        pod_spec = template.get('spec', {})
        containers = pod_spec.get('containers', [])
        
        for container in containers:
            image = container.get('image', '')
            if 'ashwins1/spe-stocksys-mjproj:spestocksys-' in image:
                service_name = image.split(':spestocksys-')[1]
                container['image'] = f"amankakadiya301/fintechdevops:{service_name}"
            
            # 2. Inject LOGSTASH_HOST for Java services
            if name in java_services:
                env = container.get('env', [])
                if not any(e.get('name') == 'LOGSTASH_HOST' for e in env):
                    env.append({'name': 'LOGSTASH_HOST', 'value': 'logstash'})
                container['env'] = env

with open('k8s/deployment.yaml', 'w') as f:
    yaml.safe_dump_all(docs, f)
