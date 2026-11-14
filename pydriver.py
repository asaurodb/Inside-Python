# Executa um programa com CPython imitando o que o Pyodide devolve (stdout, erro, valor da última expressão, variáveis).
import sys, json, ast, io, contextlib, traceback
d = json.load(sys.stdin); g = {}; buf = io.StringIO(); err = None; val = None
try:
    tree = ast.parse(d['code']); last = None
    if tree.body and isinstance(tree.body[-1], ast.Expr): last = ast.Expression(tree.body.pop().value)
    with contextlib.redirect_stdout(buf):
        exec(compile(tree, '<exec>', 'exec'), g)
        if last is not None: val = eval(compile(last, '<eval>', 'eval'), g)
except BaseException as e:
    err = 'Traceback (most recent call last):\n  ...\n' + ''.join(traceback.format_exception_only(type(e), e)).strip()
def conv(v): return v if isinstance(v, (int, float, str, bool)) or v is None else repr(v)
print(json.dumps({'out': buf.getvalue(), 'err': err, 'val': conv(val),
                  'vars': {n: conv(g[n]) for n in d.get('want', []) if n in g}}))
